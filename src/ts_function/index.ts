import { ddbData, getItem, createItem } from "./helpers/ddbClient";
import { sendMessage } from "./helpers/tgClient"
import { APIGatewayEvent } from "aws-lambda";

const TTL_DELTA = 60 * 60 * 5 // 5 hours
const getRandInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

exports.handler = async function(event: APIGatewayEvent) {
    console.log("request:", JSON.stringify(event, undefined, 2));  
    
    let dbItem : ddbData;
    const { chatId } = JSON.parse(event.body as string)
    const newDdbItem : ddbData = { id: chatId, value: getRandInt(5,35) };

    try{
      dbItem = await getItem(chatId) || await createItem(newDdbItem, TTL_DELTA)

      console.log(dbItem);

      // await sendMessage({ id: dbItem.id, text: `${dbItem.value}` });

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `Successfully finished operation: "${event.httpMethod}"`,
          body: dbItem // body
        })
      };

    } catch (err) {
      const typedError = err as Error;
      console.error(typedError);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Failed to perform operation.",
          errorMsg: typedError.message,
          errorStack: typedError.stack,
        })
      };
    }
};
