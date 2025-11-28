#!/bin/bash

set -e

TEMPLATE_FILE="cloudformation/solar-siem-complete.yaml"

echo "Validating CloudFormation template..."

# AWS CloudFormation validation
aws cloudformation validate-template --template-body file://$TEMPLATE_FILE

# Install and run cfn-lint
pip install cfn-lint
cfn-lint $TEMPLATE_FILE --info

# Install and run cfn-nag
gem install cfn-nag
cfn_nag_scan --input-path cloudformation/

echo "All validations passed!"