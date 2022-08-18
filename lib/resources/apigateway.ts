import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { LanguageFunctions } from "./functions";

interface ApiGatewayProps {
  functions: LanguageFunctions
}

export default class ApiGateway extends Construct {    
  constructor(scope: Construct, id: string, props: ApiGatewayProps){
    super(scope, id);

    this.createTemplateApi(props.functions.TypeScriptFunction);
  }

  private createTemplateApi(TypeScriptFunction: IFunction) {
    const apigw = new LambdaRestApi(this, 'TemplateAPI', {
        restApiName: 'TypeScript Response',
        handler: TypeScriptFunction,
        proxy: false,
    });

    const product = apigw.root.addResource('TemplateAPI');
    product.addMethod('POST'); // POST TemplateAPI
  }
}
