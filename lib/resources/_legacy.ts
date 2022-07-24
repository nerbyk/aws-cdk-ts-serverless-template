

import { Construct } from 'constructs';
import { RemovalPolicy, Stack, StackProps, Duration, CfnOutput } from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';

import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Runtime, Architecture } from 'aws-cdk-lib/aws-lambda';

export class CdkToolStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const region = process.env.REGION;

    const csizeTable = new dynamodb.Table(this, id, {
      tableName: 'tg_table',
      billingMode: dynamodb.BillingMode.PROVISIONED,
      removalPolicy: RemovalPolicy.DESTROY,
      partitionKey: {
        name: 'tg_id',
        type: dynamodb.AttributeType.STRING
      },
      timeToLiveAttribute: 'ttl'
    });

    const csizeHandler = new lambda.NodejsFunction(this, 'csizeHandler', {
      bundling: {
        minify: true, // minify code, defaults to false
        target: 'es2020', // target environment for the generated JavaScript code
        define: {
          'process.env.TELEGRAM_SECRET': JSON.stringify('xxx-xxxx-xxx'),
          'process.env.PRODUCTION': JSON.stringify(true)
        },
        sourceMap: true, // include source map, defaults to false
        sourceMapMode: lambda.SourceMapMode.INLINE, // defaults to SourceMapMode.DEFAULT
        logLevel: lambda.LogLevel.SILENT, // log level, defaults to LogLevel.WARNING
        keepNames: true, // defaults to false
        charset: lambda.Charset.UTF8,
        format: lambda.OutputFormat.ESM,
        environment: {
          TELEGRAM_SECRET: process.env.TELEGRAM_SECRET as string,
          REGION: region as string
        }
      },
      runtime: Runtime.NODEJS_16_X,
      timeout: Duration.seconds(60),
      logRetention: RetentionDays.ONE_WEEK,
      handler: 'index.handler',
      entry: './modules/responseLambda/index.ts',
      projectRoot: './modules/responseLambda',
      architecture: Architecture.ARM_64,
    });

    const csizeApi = new apigw.LambdaRestApi(this, 'csizeApi', {
      proxy: false,
      handler: csizeHandler
    });

    const csizeApiResource = csizeApi.root.addResource('csize');
    const csizeApiLambdaIntegration = new apigw.LambdaIntegration(csizeHandler);

    csizeApiResource.addMethod('POST', csizeApiLambdaIntegration);

    csizeHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['dynamodb:GetItem', 'dynamodb:PutItem'],
        resources: [csizeTable.tableArn]
      })
    );

    new CfnOutput(this, "BotURL", {
      value: `https://${csizeApi.restApiId}.execute-api.${region}.amazonaws.com/dev/bot`,
    });
  }
}

