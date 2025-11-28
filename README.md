# KDT_SOLAR
전자상거래 환경에서의 SOAR 구축

## 개요

본 리포지토리는 AWS상에서 운영되는 보안 자동 대응(SOAR) 시나리오를 Infrastructure as Code(CloudFormation)로 배포하기 위한 템플릿을 제공한다.

애플리케이션 웹 서버(서브넷, EC2, ALB 등)는 제외하고, 보안 관점에서의 탐지–분석–대응–알림 흐름만을 코드화하였다.

구성 대상 SOAR 시나리오는 다음과 같다.

1. S3 관련 보안 이벤트 대응 시나리오
    - S3 Public 탐지 및 대응
    - S3 버전관리 비활성화 탐지 및 대응
2. IAM 관련 이상 행위 대응 시나리오 - 오남용대응
    - Policy 부착 탐지 및 대응
    - 액세스키 생성 탐지 및 대응
    - MFA 삭제 탐지 및 비활성화 대응
    - user 생성 탐지 및 대응
    - policy/role 생성, 수정 탐지 및 대응
3. RDS Snapshot 관련 보안 이벤트 대응 시나리오
    - RDS snapshot Public 탐지 및 대응
4. 인시던트(Incident) 대응 및 알림 시나리오
    - 심각도 별 대응 (Critical, High, Medium, Low)

각 시나리오에서는 수집된 이벤트를 EventBridge로 필터링하고, Step Functions와 Lambda를 통해 자동 대응 및 Slack 알림을 수행한다. 필요한 로그 및 결과 데이터는 S3와 CloudWatch Logs에 저장된다.

서버(EC2, RDS 등) 및 서브넷/VPC 구성은 이 리포지토리에서 배포하지 않으며, 이미 운영 중인 환경 위에 보안 자동화 기능을 추가하는 구조이다.


## 파라미터 - 변경해야 하는 값

1. Slack Webhook (또는 알림 채널)

Slack Webhook URL은 사용자가 직접 올바른 값을 람다 함수에 입력해야 함

2. WAF 대상 리소스

WAF를 연결할 대상(예: ALB, API Gateway, CloudFront 등)의 ARN 또는 도메인 정보가 필요하다.

3. IAM EventBridge 필터링 대상 유저명
