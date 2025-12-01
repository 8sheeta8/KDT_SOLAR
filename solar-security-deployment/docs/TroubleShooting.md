# **🔧 Trouble Shooting**

# **1. 🔄 Security Incident 상태머신 생성 관련 이슈**

### **1.1 🔁 중복 실행 문제**

**🔍 원인:**

- 동일한 보안 이벤트가 여러 소스에서 중복으로 발생
- EventBridge나 CloudWatch에서 같은 이벤트를 여러 번 트리거

**✅ 해결방법:**

- 상태머신 시작 시 중복 체크 단계 추가

### **1.2 ⚠️ SDK Rate Limit 오류**

**🔍 원인:**

- 여러 보안 이벤트를 동시 수행할 시 SDK 실행 횟수 초과로 인해 상태머신 실행 오류 발생

**🚧 해결:**

- ❌ **아직 해결 못함** (추후 과제)

### **1.3 💬 Slack 메시지 변수 및 포맷팅 문제**

**🔍 원인:**

- Step Functions에서 동적 변수를 Slack 메시지 포맷에 올바르게 매핑하지 못함
- JSON Path 표현식 오류로 인한 변수 참조 실패

**✅ 해결방법:**

- Pass 상태를 사용하여 메시지 템플릿 사전 구성
- 변수들을 명확한 JSON Path로 참조

---

# **2. 📊 OpenSearch 대시보드 관련 이슈**

### **2.1 💰 CloudWatch Logs 구독 필터 실시간 전송으로 인한 비용 문제**

**🔍 원인:**

- CloudWatch Logs 구독 필터를 통한 실시간 로그 전송 시 **높은 비용 발생**
- 대용량 로그 데이터에 대한 지속적인 Lambda 호출로 인한 과금 증가
- 모든 로그를 실시간으로 처리할 필요성 부족

**✅ 해결방법:**

- 🗂️ S3로 로그를 배치 저장 후 EventBridge를 통한 이벤트 기반 처리로 변경
- 💸 비용 효율적인 스케줄 기반 로그 처리 구현
- ⚡ 중요한 보안 로그만 실시간 처리, 일반 로그는 배치 처리로 분리

### **2.2 🔐 OpenSearch Lambda 권한 설정 문제 (Bulk API 권한 부족)**

**🔍 원인:**

- Lambda에서 OpenSearch로 대량 데이터 전송 시 일반 HTTP 권한으로는 **한계**
- Bulk API 사용을 위한 특별한 OpenSearch 권한 미설정
- 대용량 로그 인덱싱 시 개별 문서 처리로 인한 성능 저하

**✅ 해결방법:**

- 🔑 Lambda 실행 역할에 OpenSearch Bulk API 권한(**`es:ESHttpPost for _bulk endpoint`**) 추가
- 🛡️ OpenSearch의 Fine-grained access control에서 bulk 작업 권한 명시적 허용
- ⚡ 배치 크기를 최적화하여 Bulk API 효율성 극대화

### **2.3 📈 대시보드 시각화 오류**

**🔍 원인:**

- 다시 접속 할 때 대시보드 로그 로딩 오류 발생

**🚧 해결:**

- 🔧 로그 ID 정적 설정 확인
- ❌ 매번 대시보드 로딩하지 않고 바로 확인하는 방법은 아직 해결중 (추후 과제)

---

# **3. 🚨 SIEM 시스템 Slack API 호출 과다 이슈**

### **3.1 📈 API Rate Limit 초과**

**🔍 원인:**

- 대량의 보안 이벤트 발생 시 Slack API 호출 급증
- Slack의 분당 API 호출 제한 초과
- 실패한 API 호출에 대한 재시도 로직이 추가적인 호출 유발

**🚧 해결방법:**

- 💳 **Slack Pro 사용** (임시 방편)

---

# **4. 🪣 S3 시나리오 관련 이슈**

### **4.1 🔁 Slack 알림 무한 반복 이슈**

**🔍 원인:**

- solar-s3public-eb(EventBridge) 규칙이 여러 S3 API 호출(eventName)을 모두 수신하도록 설정되어 있어 퍼블릭 차단 설정과 무관한 이벤트까지 트리거되고 있었음 

**✅ 해결방법:**

- 🎯 EventBridge 규칙을 PutBucketPublicAccessBlock API만 수신하도록 eventName을 축소
- 🛡️ 퍼블릭 접근 차단이 false(비활성화)로 설정될 때만 감지하도록 조건 추가

### **4.2 📤 eventName 전달 이슈**

**🔍 원인:**

- Lambda.invoke 통합 사용으로 입력/출력 구조가 중첩되며 eventName을 정상적으로 수신하지 못함
- JSONata로 Slack Lambda 전달 데이터를 수동 매핑하면서 Step Functions 구조와 불일치 → 값이 null로 전달
- Output 필드 사용 방식이 최신 Step Functions 구조와 맞지 않아 필드 누락 발생

**✅ 해결방법:**

- 🔧 Lambda 호출 방식을 단순화하여 일반 Lambda 호출로 변경
- 🧹 Payload 수동 매핑 제거 → Step Functions 입력 그대로 전달
- 📌 결과 저장 위치를 ResultPath로 명확히 설정
- 📦 Slack Lambda가 전체 이벤트를 직접 파싱하도록 구조 정리

### **4.3 S3 버킷 퍼블릭 차단 Lambda가 안 실행되던 문제**

**🔍 원인:**

- Lambda 역할의 정책에서 lambda.amazonaws.com만 등록되어 있었음
- EventBridge를 통해 호출하려면 events.amazonaws.com도 허용돼야 하는데 빠져 있었음

**✅ 해결방법:**

- Lambda 역할(Trust Policy)에 events.amazonaws.com 추가

---

# **5. IAM 시나리오 관련 이슈**

### **5.1 특정 이벤트에 대한 다수의 람다함수 실행 및 fail 발생**

**🔍 원인:**

- IAM user 생성 시 정책을 부착하여 생성할 경우, 정책 부착 이벤트와 유저 생성 이벤트 두 가지를 탐지하여 중복 실행 발생
- 중복 실행 발생 시, 정책이 user에 남아있어 작업이 실패

**🚧 해결방법:**

- 💳 **user 이벤트를 처리하는 람다 함수에 잠시 대기하는 코드를 추가** (임시 방편)

---
> 📌 참고사항
> ✅ 해결됨
> 🚧 진행중
> ❌ 미해결
