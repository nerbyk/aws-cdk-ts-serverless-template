import { RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, BillingMode, ITable, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export default class Database extends Construct {
  public readonly baseTable: ITable;

  constructor(scope: Construct, id: string){
    super(scope, id);
    
    this.baseTable = this.createBaseTable();
  }

  private createBaseTable() : ITable {
    const productTable = new Table(this, 'base', {
        partitionKey: {
            name: 'id',
            type: AttributeType.STRING
        },
        tableName: 'base',
        removalPolicy: RemovalPolicy.DESTROY,
        billingMode: BillingMode.PAY_PER_REQUEST,
        timeToLiveAttribute: 'ttl'
    });

    return productTable;
  }
}