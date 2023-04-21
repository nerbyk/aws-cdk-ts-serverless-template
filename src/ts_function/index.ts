import { APIGatewayEvent } from "aws-lambda";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

type ConnectionData = {
  region: string;
  tableName: string;
}

class DBClient {
  documentClient: DynamoDBClient;
  tableName: string;
  params: { TableName: string };
  
  constructor(connectionData: ConnectionData) {
    this.documentClient = new DynamoDBClient({ region: connectionData.region });
    this.tableName = connectionData.tableName;
    this.params = { TableName: this.tableName };
  }
  
  getRequest = async (uid: string) => await this.documentClient
    .get({ ...this.params, Key: { uid } })
    .promise();
}

const DB = new DBClient({ region: 'eu-central-1', tableName: process.env.TABLE_NAME});

exports.handler = async function(event: APIGatewayEvent) {
  console.log("request:", JSON.stringify(event, undefined, 2));  
  
  const data = await DB.getRequest(marshall(event.pathParameters.uid));
  
  return {
    statusCode: 200,
    body: JSON.stringify(unmarshall(data))  
  };
}

