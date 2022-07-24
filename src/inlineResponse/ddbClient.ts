// Create service client module using ES6 syntax.
import { AttributeValue, DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
// Create an Amazon DynamoDB service client object.
export type ddbData = 
  {
    id: string;
    value: number;
    ttl?: number;
  }

const ddbClient = new DynamoDBClient({ region: process.env.REGION });

export { ddbClient };

export const createItem = async (event: ddbData) => {
  console.log(`createItem function. event : "${event}"`);
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: marshall(event)
    };

    const createInlineResponse = await ddbClient.send(new PutItemCommand(params));

    console.log(createInlineResponse);
    return createInlineResponse;
  } catch(e) { 
    console.error(e);
    throw e;
  }
}

export const getItem = async (id: string) => {
  console.log(`getItem function. id: "${id}"`);

  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ id })
    };

    const { Item } = await ddbClient.send(new GetItemCommand(params));

    console.log(Item);
    return (Item) ? unmarshall(Item) : {};

  } catch (e) {
    console.error(e);
    throw e;
  }
}

