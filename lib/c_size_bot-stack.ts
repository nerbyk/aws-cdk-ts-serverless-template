import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ApiGateway  from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CSizeBotStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
  }
}
