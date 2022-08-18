import { Duration } from "aws-cdk-lib";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Code, Runtime, Function, IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { Charset, LogLevel, NodejsFunction, NodejsFunctionProps, OutputFormat, SourceMapMode } from "aws-cdk-lib/aws-lambda-nodejs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { join } from "path";

interface FunctionsProps {
  baseTable: ITable;
  tgSecret: string;
  region: string;
}

export type LanguageFunctions = {
  TypeScriptFunction: IFunction,
  RubyFunction: IFunction
}

export default class Functions extends Construct {
  readonly TypeScriptFunction: NodejsFunction;
  readonly RubyFunction: Function;

  constructor(scope: Construct, id: string, props: FunctionsProps){
    super(scope, id);    

    this.TypeScriptFunction = this.createTypeScripteFunction(props.baseTable, props.tgSecret, props.region);
    this.RubyFunction = this.createRubyFunction(props.baseTable, props.tgSecret, props.region);
  }

  public all = (): LanguageFunctions => ({ 
    TypeScriptFunction: this.TypeScriptFunction, 
    RubyFunction: this.RubyFunction
  });

  private createTypeScripteFunction(baseTable: ITable, tgSecret: string, region: string) : NodejsFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ['aws-sdk', 'crypto'],
        minify: false, // minify code, defaults to false
        define: {
          'process.env.TELEGRAM_SECRET': JSON.stringify('xxx-xxxx-xxx'),
          'process.env.DYNAMODB_TABLE_NAME': JSON.stringify('table-name'), 
          'process.env.REGION': JSON.stringify('region')
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
      // architecture: Architecture.ARM_64, // need to research arm runtime support
      environment: {
        DYNAMODB_TABLE_NAME: baseTable.tableName,
        TELEGRAM_SECRET: tgSecret as string, 
        REGION: region as string
      }
    }
    const TypeScriptFunction = new NodejsFunction(this, 'TypeScriptFunction', {
      entry: join(__dirname, `/../../src/ts_function/index.ts`),
      ...nodeJsFunctionProps,
    });

    baseTable.grantReadWriteData(TypeScriptFunction);

    return TypeScriptFunction;
  };

  private createRubyFunction(baseTable: ITable, tgSecret: string, region: string) : Function { 
    const RubyFunctionProps = {
      code: Code.fromAsset(join(__dirname, `/../../src/ruby_function/`)),
      handler: 'index.handler',
      runtime: Runtime.RUBY_2_7,
      timeout: Duration.seconds(60),
      logRetention: RetentionDays.ONE_WEEK,
      environment: {
        DYNAMODB_TABLE_NAME: baseTable.tableName,
        TELEGRAM_SECRET: tgSecret as string, 
        REGION: region as string
      }
    }
    
    const RubyFunction = new Function(this, 'RubyFunction', RubyFunctionProps);

    baseTable.grantReadWriteData(RubyFunction);

    return RubyFunction;
  }

  // private createGoFunction(baseTable: ITable, tgSecret: string, region: string) : Function { 
  //   const GoFunctionProps = {
  //     code: Code.fromAsset(join(__dirname, `/../../src/go_function/`)),
  //     handler: 'index.handler',
  //     runtime: Runtime.GO_1_X,
  //     timeout: Duration.seconds(60),
  //     logRetention: RetentionDays.ONE_WEEK,
  //     environment: {
  //       DYNAMODB_TABLE_NAME: baseTable.tableName,
  //       TELEGRAM_SECRET: tgSecret as string, 
  //       REGION: region as string
  //     },
  //     memorySize: 256,
  //     reservedConcurrentExecutions: 1
  //   }
    
  //   const GoFunction = new Function(this, 'GoFunction', GoFunctionProps);

  //   baseTable.grantReadWriteData(GoFunction);

  //   return GoFunction;
  // }
}