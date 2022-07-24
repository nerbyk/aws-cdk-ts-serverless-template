import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface ApiGatewayProps {
    inlineResponseFunction: IFunction
}

export default class ApiGateway extends Construct {    
  constructor(scope: Construct, id: string, props: ApiGatewayProps){
    super(scope, id);

    this.createCSizeBotApi(props.inlineResponseFunction);
  }

  private createCSizeBotApi(inlineResponseFunction: IFunction) {
    const apigw = new LambdaRestApi(this, 'CSizeBotApi', {
        restApiName: 'Inline Response',
        handler: inlineResponseFunction,
        proxy: false,
    });

    const product = apigw.root.addResource('CSizeBotApi');
    product.addMethod('POST'); // POST CSizeBotApi 
  }
}