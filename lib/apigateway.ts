import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface ApiGatewayProps {
    inlineResponseFunction: IFunction
}

export class ApiGateway extends Construct {    
  constructor(scope: Construct, id: string, props: ApiGatewayProps){
    super(scope, id);

    this.createInlineResponseApi(props.inlineResponseFunction);
  }

  private createInlineResponseApi(inlineResponseFunction: IFunction) {
    const apigw = new LambdaRestApi(this, 'inlineResponseApi', {
        restApiName: 'Inline Response',
        handler: inlineResponseFunction,
        proxy: false,
    });

    const product = apigw.root.addResource('inlineResponse');
    product.addMethod('POST'); // POST /product
  }
}