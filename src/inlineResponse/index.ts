import { ddbData, getItem, createItem } from "./ddbClient";
import { sendMessage } from "./tgClient"
import { APIGatewayEvent } from "aws-lambda";

const TTL_DELTA = 60 * 60 * 5 // 5 hours
const getRandInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

exports.handler = async function(event: APIGatewayEvent) {
    console.log("request:", JSON.stringify(event, undefined, 2));  
    
    let body;
    const { chatId } = JSON.parse(event.body as string)
    const newDdbItem : ddbData = { id: chatId, value: getRandInt(5,35), ttl: Date.now() + TTL_DELTA }

    try{
      body = await getItem(chatId) || await createItem(newDdbItem)

      console.log(body);

      await sendMessage(chatId, body.value)

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `Successfully finished operation: "${event.httpMethod}"`,
          body: body
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
