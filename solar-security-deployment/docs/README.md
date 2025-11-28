# Solar SIEM/SOAR Infrastructure

이 리포지토리는 Solar SIEM/SOAR 시스템의 AWS 인프라를 자동으로 배포하기 위한 CloudFormation 템플릿과 CI/CD 파이프라인을 포함합니다.

## 🏗️ 아키텍처

Solar SIEM/SOAR 시스템은 다음 구성 요소를 포함합니다:

- **보안 사건 대응 자동화** (Step Functions)
- **IAM 보안 자동 응답** (SOAR)
- **실시간 로그 분석** (Lambda + OpenSearch)
- **위협 탐지** (CloudTrail + EventBridge)
- **웹 애플리케이션 방화벽** (AWS WAF)
- **알림 시스템** (SNS + Slack)

## 🚀 빠른 시작

### 전제 조건

- AWS CLI 설치 및 구성
- 적절한 AWS IAM 권한
- GitHub Actions 또는 AWS CodePipeline 설정

### 로컬 배포

```bash
# 1. 리포지토리 클론
git clone https://github.com/your-org/solar-siem-infrastructure.git
cd solar-siem-infrastructure

# 2. 파라미터 파일 수정
vim cloudformation/parameters/dev.json

# 3. 배포 실행
./scripts/deploy.sh --environment dev

# 4. 프로덕션 배포 (확인 필요)
./scripts/deploy.sh --environment prod --region us-west-2
