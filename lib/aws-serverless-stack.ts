

import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Database } from './database';
import { Functions } from './functions';
import { ApiGateway } from './apigateway';
import * as dotenv from 'dotenv';

dotenv.config();

export class AwsServerlessStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const database = new Database(this, 'Database');

    const functions = new Functions(this, 'Functions', {
      baseTable: database.baseTable, 
      tgSecret: process.env.TELEGRAM_SECRET as string
    });

    const apigateway = new ApiGateway(this, 'ApiGateway', {
      inlineResponseFunction: functions.inlineResponseFunction
    });
  }
}