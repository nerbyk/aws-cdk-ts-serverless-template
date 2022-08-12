// Create service client module using ES6 syntax.
import { DynamoDBClient, GetItemCommand, GetItemOutput, PutItemCommand, PutItemOutput } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

type ddbData = {
    id: string;
    value?: number;
    ttl?: number;
};

const DYNAMODB_TABLE_NAME = process.env.DYNAMODB_TABLE_NAME as string;
const REGION              = process.env.REGION as string;
const ddbClient           = new DynamoDBClient({region: REGION});
const defaultParams       = { TableName: DYNAMODB_TABLE_NAME };

export type { ddbData };

export const createItem = async (event: ddbData, expires?: number) : Promise<ddbData> => {
  console.log(`createItem function. event : "${event}"`);

  try {
    if (expires) {
      event.ttl = Math.round(Date.now() / 1000) + expires;
    }

    const params = {
      ...defaultParams, 
      Key: marshall({ id: event.id }),
      Item: marshall({value: event.value, ttl: event.ttl}),
      ReturnValues: "UPDATED_NEW",
    }

    const putOutput : PutItemOutput = await ddbClient.send(new PutItemCommand(params));

    if (typeof(putOutput.Attributes) == undefined)
      throw new Error("Failed to create item.");

    return unmarshall(putOutput.Attributes!) as ddbData;
  } catch(err) { 
    console.error(err);
    throw err;
  }
}

export const getItem = async (id: string) : Promise<ddbData> => {
  console.log(`getItem function. id: "${id}"`);

  try {
    const params = {
      ...defaultParams,
      Key: marshall({ id })
    };

    const getOuput : GetItemOutput = await ddbClient.send(new GetItemCommand(params));

    return unmarshall(getOuput.Item!) as ddbData
  } catch (err) {
    console.error(err);
    throw err;
  }
}

