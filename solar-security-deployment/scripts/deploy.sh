#!/bin/bash

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
TEMPLATE_FILE="$PROJECT_DIR/cloudformation/solar-siem-complete.yaml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

usage() {
    cat << EOF
Usage: $0 [OPTIONS]

Deploy Solar SIEM/SOAR infrastructure to AWS

OPTIONS:
    -e, --environment ENV    Environment to deploy (dev|staging|prod)
    -r, --region REGION      AWS region (default: us-east-1)
    -p, --profile PROFILE    AWS profile to use
    -v, --validate-only      Only validate template, don't deploy
    -h, --help              Show this help message

EXAMPLES:
    $0 --environment dev
    $0 --environment prod --region us-west-2 --profile production
    $0 --validate-only

EOF
}

validate_template() {
    log_info "Validating CloudFormation template..."
    
    if ! aws cloudformation validate-template \
        --template-body file://"$TEMPLATE_FILE" >/dev/null; then
        log_error "Template validation failed"
        return 1
    fi
    
    log_info "Template validation successful"
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI is not installed"
        return 1
    fi
    
    # Check jq
    if ! command -v jq &> /dev/null; then
        log_error "jq is not installed"
        return 1
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity >/dev/null 2>&1; then
        log_error "AWS credentials not configured or invalid"
        return 1
    fi
    
    log_info "Prerequisites check passed"
}

deploy_stack() {
    local env=$1
    local region=$2
    
    local stack_name="solar-siem-$env"
    local param_file="$PROJECT_DIR/cloudformation/parameters/$env.json"
    
    log_info "Deploying to environment: $env"
    log_info "Stack name: $stack_name"
    log_info "Region: $region"
    
    if [[ ! -f "$param_file" ]]; then
        log_error "Parameter file not found: $param_file"
        return 1
    fi
    
    # Check if stack exists
    if aws cloudformation describe-stacks --stack-name "$stack_name" --region "$region" >/dev/null 2>&1; then
        log_info "Stack exists, creating change set..."
        
        local changeset_name="changeset-$(date +%Y%m%d-%H%M%S)"
        
        aws cloudformation create-change-set \
            --stack-name "$stack_name" \
            --template-body file://"$TEMPLATE_FILE" \
            --parameters file://"$param_file" \
            --capabilities CAPABILITY_NAMED_IAM \
            --change-set-name "$changeset_name" \
            --region "$region" \
            --tags Key=Environment,Value="$env" Key=Project,Value=SolarSIEM Key=ManagedBy,Value=Script
        
        # Wait for change set creation
        log_info "Waiting for change set creation..."
        aws cloudformation wait change-set-create-complete \
            --stack-name "$stack_name" \
            --change-set-name "$changeset_name" \
            --region "$region"
        
        # Show changes
        log_info "Changes to be applied:"
        aws cloudformation describe-change-set \
            --stack-name "$stack_name" \
            --change-set-name "$changeset_name" \
            --region "$region" \
            --query 'Changes[*].[Action,ResourceChange.LogicalResourceId,ResourceChange.ResourceType]' \
            --output table
        
        # Confirm execution
        if [[ "$env" == "prod" ]]; then
            read -p "This is PRODUCTION deployment. Are you sure? (yes/no): " confirm
            if [[ $confirm != "yes" ]]; then
                log_warn "Deployment cancelled"
                return 1
            fi
        fi
        
        # Execute change set
        log_info "Executing change set..."
        aws cloudformation execute-change-set \
            --stack-name "$stack_name" \
            --change-set-name "$changeset_name" \
            --region "$region"
        
        # Wait for completion
        log_info "Waiting for stack update to complete..."
        aws cloudformation wait stack-update-complete \
            --stack-name "$stack_name" \
            --region "$region"
    else
        log_info "Stack does not exist, creating new stack..."
        
        aws cloudformation create-stack \
            --stack-name "$stack_name" \
            --template-body file://"$TEMPLATE_FILE" \
            --parameters file://"$param_file" \
            --capabilities CAPABILITY_NAMED_IAM \
            --region "$region" \
            --tags Key=Environment,Value="$env" Key=Project,Value=SolarSIEM Key=ManagedBy,Value=Script
        
        # Wait for completion
        log_info "Waiting for stack creation to complete..."
        aws cloudformation wait stack-create-complete \
            --stack-name "$stack_name" \
            --region "$region"
    fi
    
    # Show outputs
    log_info "Deployment completed successfully!"
    log_info "Stack outputs:"
    aws cloudformation describe-stacks \
        --stack-name "$stack_name" \
        --region "$region" \
        --query 'Stacks[0].Outputs[*].[OutputKey,OutputValue,Description]' \
        --output table
}

# Main script
main() {
    local environment=""
    local region="us-east-1"
    local profile=""
    local validate_only=false
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -e|--environment)
                environment="$2"
                shift 2
                ;;
            -r|--region)
                region="$2"
                shift 2
                ;;
            -p|--profile)
                profile="$2"
                shift 2
                ;;
            -v|--validate-only)
                validate_only=true
                shift
                ;;
            -h|--help)
                usage
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                usage
                exit 1
                ;;
        esac
    done
    
    # Set AWS profile if provided
    if [[ -n "$profile" ]]; then
        export AWS_PROFILE="$profile"
    fi
    
    # Set AWS region
    export AWS_DEFAULT_REGION="$region"
    
    # Check prerequisites
    check_prerequisites
    
    # Validate template
    validate_template
    
    if [[ "$validate_only" == true ]]; then
        log_info "Validation complete, exiting..."
        exit 0
    fi
    
    # Validate environment
    if [[ -z "$environment" ]]; then
        log_error "Environment must be specified"
        usage
        exit 1
    fi
    
    if [[ ! "$environment" =~ ^(dev|staging|prod)$ ]]; then
        log_error "Invalid environment: $environment (must be dev, staging, or prod)"
        exit 1
    fi
    
    # Deploy
    deploy_stack "$environment" "$region"
}

# Run main function
main "$@"