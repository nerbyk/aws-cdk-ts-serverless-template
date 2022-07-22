#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CSizeBotStack } from '../lib/c_size_bot-stack';

const app = new cdk.App();

new CSizeBotStack(app, 'CSizeBotStack', { });