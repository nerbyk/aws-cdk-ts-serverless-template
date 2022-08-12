#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import * as dotenv from 'dotenv';
import { AwsServerlessStack } from '../lib/aws-serverless-stack';

const app = new cdk.App();
new AwsServerlessStack(app, 'AwsServerlessStackPlayground', {
  env: { ...dotenv.config().parsed },
});
