import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DB, Lambdas, ApiGateway } from './resources' 
import * as dotenv from 'dotenv';

dotenv.config();
export class AwsServerlessStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const database = new DB(this, 'Database');

    const functions = new Lambdas(this, 'Functions', {
      baseTable: database.baseTable, 
      tgSecret: process.env.TELEGRAM_SECRET as string, 
      region: process.env.REGION as string
    });

    const apigateway = new ApiGateway(this, 'ApiGateway', {
      inlineResponseFunction: functions.inlineResponseFunction
    });
  }
}