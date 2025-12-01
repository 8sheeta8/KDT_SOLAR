# 🛡️ Solar SIEM/SOAR - AWS 통합 보안 플랫폼

<div align="center">
  
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![CloudFormation](https://img.shields.io/badge/CloudFormation-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Security](https://img.shields.io/badge/Security-FF6B6B?style=for-the-badge&logo=shield&logoColor=white)

**Enterprise-grade SIEM/SOAR solution for AWS cloud environments**

[🚀 Quick Start](#-quick-start) • [📋 Prerequisites](#-prerequisites) • [🔧 Configuration](#-configuration) • [📖 Documentation](#-documentation)

</div>

---

## 🌟 프로젝트 소개

Solar SIEM/SOAR는 AWS 클라우드 환경을 위한 완전 자동화된 보안 정보 및 이벤트 관리(SIEM) 플랫폼입니다. 실시간 위협 탐지부터 자동화된 보안 대응까지, 포괄적인 보안 솔루션을 제공합니다.

### ✨ 핵심 기능

🔍 **실시간 위협 탐지**
- CloudTrail 이벤트 실시간 분석
- WAF 공격 패턴 감지
- VPC Flow Logs 이상 트래픽 탐지
- Security Hub 통합 모니터링

🤖 **자동화된 보안 대응 (SOAR)**
- 의심스러운 IP 자동 차단
- 비정상적인 IAM 활동 롤백
- S3 퍼블릭 액세스 자동 차단
- RDS 스냅샷 보안 설정 자동 복구

📊 **통합 로그 관리**
- OpenSearch 기반 중앙집중식 로그 저장
- Kinesis Firehose를 통한 실시간 스트리밍
- 자동화된 로그 수명주기 관리
- 포렌식 분석을 위한 장기 보관

🚨 **실시간 알림 시스템**
- Slack 통합 즉시 알림
- 심각도별 알림 분류
- 대응 조치 자동 리포팅
- 커스터마이징 가능한 알림 규칙

---

## 📋 Prerequisites

### 🔧 기술 요구사항

| 구분 | 요구사항 | 버전/설정 |
|------|----------|-----------|
| **AWS CLI** | 설치 및 설정 완료 | v2.0+ |
| **AWS 계정** | 관리자 권한 | - |
| **Slack 워크스페이스** | Incoming Webhooks 설정 | - |
| **OpenSearch 도메인** | 사전 구축 (선택사항) | 7.10+ |
| **VPC** | 기존 VPC 또는 신규 생성 | - |

### 🔑 필수 AWS 권한

배포를 위해 다음 권한이 필요합니다:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cloudformation:*",
        "iam:*",
        "lambda:*",
        "s3:*",
        "sns:*",
        "events:*",
        "states:*",
        "wafv2:*",
        "cloudfront:*",
        "cloudtrail:*",
        "logs:*",
        "firehose:*",
        "ec2:*",
        "kms:*"
      ],
      "Resource": "*"
    }
  ]
}
```

### 🌐 네트워크 요구사항

- **VPC**: 최소 2개 서브넷 (다른 AZ)
- **인터넷 게이트웨이**: Lambda 함수의 외부 API 호출용
- **NAT 게이트웨이**: VPC 내 Lambda 함수용 (선택사항)
- **보안 그룹**: HTTPS(443) 아웃바운드 허용

---

## 🚀 Quick Start

### 1️⃣ 저장소 클론

```bash
git clone https://github.com/8sheeta8/KDT_SOLAR
cd KDT_SOLAR
```

### 2️⃣ 사전 설정

#### Slack Webhook URL 생성
1. Slack 워크스페이스에서 **Apps** → **Incoming Webhooks** 검색
2. **Add to Slack** 클릭
3. 채널 선택 후 **Add Incoming WebHooks integration**
4. **Webhook URL** 복사 저장

#### AWS 환경 설정 확인
```bash
# AWS CLI 설정 확인
aws sts get-caller-identity

# 기본 리전 설정 확인
aws configure get region
```

### 3️⃣ 배포 실행

#### 방법 1: 간단 배포 (추천)
```bash
# 배포 스크립트 실행
./deploy.sh
```

#### 방법 2: 수동 배포
```bash
# 1. 템플릿 검증
aws cloudformation validate-template \
  --template-body file://solar-security-cloudformation-template.yaml

# 2. 스택 생성
aws cloudformation create-stack \
  --stack-name solar-siem-infrastructure \
  --template-body file://solar-security-cloudformation-template.yaml \
  --parameters \
    ParameterKey=SlackWebhookURL,ParameterValue="https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK" \
    ParameterKey=OpenSearchEndpoint,ParameterValue="https://your-opensearch-domain.region.es.amazonaws.com" \
    ParameterKey=VPCId,ParameterValue="vpc-xxxxxxxxx" \
    ParameterKey=DefaultVPCId,ParameterValue="vpc-yyyyyyyyy" \
    ParameterKey=SubnetIds,ParameterValue="subnet-aaaaa,subnet-bbbbb" \
  --capabilities CAPABILITY_NAMED_IAM \
  --enable-termination-protection
```

### 4️⃣ 배포 상태 확인

```bash
# 배포 진행상황 모니터링
aws cloudformation describe-stacks \
  --stack-name solar-siem-infrastructure \
  --query 'Stacks[0].StackStatus'

# 배포 이벤트 실시간 확인
aws cloudformation describe-stack-events \
  --stack-name solar-siem-infrastructure \
  --query 'StackEvents[0:10].[Timestamp,ResourceStatus,ResourceType,LogicalResourceId]' \
  --output table
```

---

## 🔧 Configuration

### 📝 필수 파라미터

| 파라미터 | 설명 | 예시 | 필수여부 |
|----------|------|------|----------|
| `SlackWebhookURL` | Slack Incoming Webhook URL | `https://hooks.slack.com/services/...` | ✅ |
| `VPCId` | 메인 VPC ID | `vpc-0123456789abcdef0` | ✅ |
| `SubnetIds` | 서브넷 ID 목록 (쉼표구분) | `subnet-111,subnet-222` | ✅ |
| `OpenSearchEndpoint` | OpenSearch 도메인 엔드포인트 | `https://vpc-domain.region.es.amazonaws.com` | ❌ |
| `DefaultVPCId` | 기본 VPC ID | `vpc-abcdef0123456789` | ❌ |

### ⚙️ 설정 파일 사용 (권장)

`parameters.json` 파일 생성:
```json
[
  {
    "ParameterKey": "SlackWebhookURL",
    "ParameterValue": "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
  },
  {
    "ParameterKey": "VPCId", 
    "ParameterValue": "vpc-0123456789abcdef0"
  },
  {
    "ParameterKey": "SubnetIds",
    "ParameterValue": "subnet-0123456789abcdef0,subnet-fedcba9876543210"
  },
  {
    "ParameterKey": "OpenSearchEndpoint",
    "ParameterValue": "https://vpc-your-opensearch.us-east-1.es.amazonaws.com"
  },
  {
    "ParameterKey": "DefaultVPCId",
    "ParameterValue": "vpc-abcdef0123456789"
  }
]
```

배포 시 파라미터 파일 사용:
```bash
aws cloudformation create-stack \
  --stack-name solar-siem-infrastructure \
  --template-body file://solar-security-cloudformation-template.yaml \
  --parameters file://parameters.json \
  --capabilities CAPABILITY_NAMED_IAM
```

---

## 🏗️ 아키텍처 구성요소

### 🔍 데이터 수집 계층
- **CloudTrail**: API 호출 로깅
- **VPC Flow Logs**: 네트워크 트래픽 모니터링
- **WAF Logs**: 웹 애플리케이션 공격 탐지
- **CloudWatch Logs**: 애플리케이션 및 시스템 로그

### 🔄 데이터 처리 계층
- **Kinesis Firehose**: 실시간 스트리밍
- **Lambda Functions**: 이벤트 처리 및 변환
- **EventBridge**: 이벤트 라우팅
- **Step Functions**: 워크플로우 오케스트레이션

### 💾 저장 및 분석 계층
- **S3 Buckets**: 로그 저장소
- **OpenSearch**: 검색 및 분석
- **CloudWatch**: 메트릭 및 대시보드

### 🚨 알림 및 대응 계층
- **SNS**: 알림 발송
- **Slack Integration**: 실시간 알림
- **Automated Response**: 자동화된 보안 대응

---

## 🎯 주요 기능 및 효과

### 🔐 보안 자동화 기능

#### 1. IAM 보안 자동화
- ✅ 비정상적인 정책 연결 자동 롤백
- ✅ 의심스러운 액세스 키 생성 차단
- ✅ MFA 비활성화 시 사용자 자동 차단
- ✅ 권한 에스컬레이션 시도 차단

#### 2. S3 보안 자동화
- ✅ 퍼블릭 액세스 설정 자동 차단
- ✅ 버저닝 비활성화 시 자동 복구
- ✅ 암호화 설정 자동 적용
- ✅ 버킷 정책 변경 감지 및 알림

#### 3. 네트워크 보안 자동화
- ✅ 악성 IP 자동 차단 (WAF 연동)
- ✅ 비정상 트래픽 패턴 탐지
- ✅ 보안 그룹 변경 모니터링
- ✅ VPC 변경사항 실시간 추적

#### 4. RDS 보안 자동화
- ✅ 스냅샷 퍼블릭 공유 자동 차단
- ✅ 데이터베이스 설정 변경 모니터링
- ✅ 백업 설정 검증

### 📊 모니터링 및 분석 효과

#### 실시간 가시성 확보
- 📈 **통합 대시보드**: 모든 보안 이벤트 한눈에 파악
- 📈 **실시간 알림**: 평균 1분 이내 위협 탐지 알림
- 📈 **트렌드 분석**: 보안 위협 패턴 및 동향 파악

#### 컴플라이언스 지원
- 📋 **감사 로그**: 모든 보안 이벤트 상세 기록
- 📋 **리포팅**: 자동화된 보안 상태 리포트

---

## 🚦 배포 후 검증

### ✅ 기본 기능 테스트

#### 1. Slack 알림 테스트
```bash
# SNS 토픽으로 테스트 메시지 발송
aws sns publish \
  --topic-arn "arn:aws:sns:region:account:solar_siem_topic" \
  --message "Solar SIEM Test Alert"
```

#### 2. Step Functions 동작 확인
```bash
# 실행 중인 Step Functions 확인
aws stepfunctions list-executions \
  --state-machine-arn "arn:aws:states:region:account:stateMachine:solar_sf_security-incident"
```

#### 3. Lambda 함수 테스트
```bash
# Lambda 함수 목록 확인
aws lambda list-functions \
  --query 'Functions[?starts_with(FunctionName, `solar_`)].FunctionName'
```

#### 4. WAF 규칙 동작 확인
```bash
# WAF 웹 ACL 상태 확인
aws wafv2 get-web-acl \
  --scope CLOUDFRONT \
  --id "web-acl-id" \
  --name "solar-waf-acl-g"
```

### 🧪 보안 시나리오 테스트

#### Test Case 1: S3 퍼블릭 설정 자동 차단
```bash
# 테스트용 S3 버킷 생성
aws s3 mb s3://test-solar-siem-bucket

# 퍼블릭 액세스 활성화 시도 (자동 차단되어야 함)
aws s3api put-public-access-block \
  --bucket test-solar-siem-bucket \
  --public-access-block-configuration \
  "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
```

#### Test Case 2: IAM 권한 에스컬레이션 탐지
```bash
# 테스트 사용자 생성
aws iam create-user --user-name test-solar-user

# 관리자 정책 연결 시도 (자동 차단되어야 함)
aws iam attach-user-policy \
  --user-name test-solar-user \
  --policy-arn "arn:aws:iam::aws:policy/AdministratorAccess"
```

---

## 📚 사용 가이드

### 🔍 로그 분석 및 검색

#### OpenSearch에서 보안 이벤트 검색
```json
# 의심스러운 IP 활동 검색
{
  "query": {
    "bool": {
      "must": [
        {"match": {"sourceIPAddress": "suspicious-ip"}},
        {"range": {"eventTime": {"gte": "now-1h"}}}
      ]
    }
  }
}
```

#### CloudWatch 메트릭 활용
```bash
# 보안 인시던트 메트릭 조회
aws cloudwatch get-metric-statistics \
  --namespace "Security/Incidents" \
  --metric-name "IncidentCount" \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 3600 \
  --statistics Sum
```

### 🔧 커스터마이징 가이드

#### 새로운 보안 규칙 추가
1. `lambda` 디렉토리에 새 함수 코드 작성
2. CloudFormation 템플릿에 Lambda 리소스 추가
3. EventBridge 규칙에 새 이벤트 패턴 설정

#### Slack 알림 커스터마이징
```python
# Lambda 함수 내 메시지 포맷 수정 예시
def create_slack_message(alert_data):
    severity_emoji = {
        'CRITICAL': '🔴',
        'HIGH': '🟠', 
        'MEDIUM': '🟡',
        'LOW': '🟢'
    }
    
    return {
        "text": f"{severity_emoji.get(alert_data['severity'])} {alert_data['message']}",
        "username": "Solar SIEM Bot",
        "channel": "#security-alerts"
    }
```

---

## 🔧 운영 및 유지보수

### 📊 일일 운영 체크리스트

#### 매일 확인사항
- [ ] Slack 알림 채널 확인
- [ ] CloudWatch 대시보드 리뷰
- [ ] Step Functions 실행 상태 확인
- [ ] S3 버킷 용량 모니터링

#### 주간 확인사항
- [ ] OpenSearch 인덱스 정리
- [ ] Lambda 함수 오류 로그 검토
- [ ] 보안 메트릭 트렌드 분석
- [ ] 비용 사용량 검토

#### 월간 확인사항
- [ ] 보안 정책 업데이트 검토
- [ ] 시스템 성능 최적화
- [ ] 백업 및 복구 프로세스 테스트
- [ ] 컴플라이언스 리포트 생성

### 🚨 문제 해결 가이드

#### 자주 발생하는 문제들

**1. Lambda 함수 타임아웃**
```bash
# 해결방법: 타임아웃 시간 증가
aws lambda update-function-configuration \
  --function-name solar_lambda_function \
  --timeout 900
```

**2. OpenSearch 연결 오류**
```bash
# 해결방법: VPC 설정 확인
aws es describe-elasticsearch-domain \
  --domain-name your-opensearch-domain
```

**3. Slack 알림 실패**
```bash
# 해결방법: Webhook URL 확인
aws lambda get-function-configuration \
  --function-name solar_lambda_to-slack \
  --query 'Environment.Variables.SLACK_WEBHOOK_URL'
```

## 📖 documentation

### 📚 관련 문서
- [AWS CloudFormation Guide](https://docs.aws.amazon.com/ko_kr/prescriptive-guidance/latest/least-privilege-cloudformation/permissions-use-cloudformation.html)
- [AWS S3 Versioning Guide](https://docs.aws.amazon.com/ko_kr/AmazonS3/latest/userguide/manage-versioning-examples.html)


### 🔗 유용한 링크
- [AWS S3 Security Blog]([https://aws.amazon.com/blogs/security/](https://dev.classmethod.jp/articles/jw-configuration-that-utilizes-aws-lambda-to-automatically-block-s3-public-access/))
- [CloudFormation Blog](https://nearhome.tistory.com/117)
- [AWS Openserach Blog](https://repost.aws/articles/ARlnlpfQIFSISRopWeP-zuVw/vpc-외부에서-open-search-dashboards에-엑세스하는-방법)

---

<div align="center">

**🛡️ Stay Secure with Solar SIEM/SOAR 🛡️**


[⬆️ Back to Top](#️-solar-siemsoar---aws-통합-보안-플랫폼)

</div>
