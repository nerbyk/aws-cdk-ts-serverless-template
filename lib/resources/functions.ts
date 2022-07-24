import { Duration } from "aws-cdk-lib";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { Charset, LogLevel, NodejsFunction, NodejsFunctionProps, OutputFormat, SourceMapMode } from "aws-cdk-lib/aws-lambda-nodejs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { join } from "path";


interface FunctionsProps {
  baseTable: ITable;
  tgSecret: string;
}

export default class Functions extends Construct {

  public readonly inlineResponseFunction: NodejsFunction;

  constructor(scope: Construct, id: string, props: FunctionsProps){
    super(scope, id);    

    this.inlineResponseFunction = this.createInlineResponseFunction(props.baseTable, props.tgSecret);
  }

  private createInlineResponseFunction(baseTable: ITable, tgSecret: string) : NodejsFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          'aws-sdk'
        ],
        minify: true, // minify code, defaults to false
        define: {
          'process.env.TELEGRAM_SECRET': JSON.stringify('xxx-xxxx-xxx'),
          'process.env.DYNAMODB_TABLE_NAME': JSON.stringify('table-name')
        },
        sourceMap: true, // include source map, defaults to false
        sourceMapMode: SourceMapMode.INLINE, // defaults to SourceMapMode.DEFAULT
        logLevel: LogLevel.SILENT, // log level, defaults to LogLevel.WARNING
        keepNames: true, // defaults to false
        charset: Charset.UTF8,
        format: OutputFormat.ESM,
      },
      runtime: Runtime.NODEJS_16_X,
      timeout: Duration.seconds(60),
      logRetention: RetentionDays.ONE_WEEK,
      architecture: Architecture.ARM_64,
      environment: {
        DYNAMODB_TABLE_NAME: baseTable.tableName,
        TELEGRAM_SECRET: tgSecret as string
      }
    }
    const inlineResponseFunction = new NodejsFunction(this, 'inlineResponseLambdaFunction', {
      entry: join(__dirname, `/../src/inlineResponse/index.ts`),
      ...nodeJsFunctionProps,
    });

    baseTable.grantReadWriteData(inlineResponseFunction);
    return inlineResponseFunction;
  };
}