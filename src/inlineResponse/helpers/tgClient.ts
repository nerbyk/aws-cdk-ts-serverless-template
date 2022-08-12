import fetch from 'node-fetch';


const TELEGRAM_TOKEN = process.env.TELEGRAM_SECRET || "5365978765:AAFGnf10Do28Tr3pEDhA7oePvMe-ffO_EF8";

export type tgData = {
  chat_id: string, 
  text: string
}

export const sendMessage = async (params: { id: string, text: string }) => { 
  await sendTelegramCommand('sendMessage', 
    { chat_id: params.id, text: params.text }
  );
}

const sendTelegramCommand = async (url: string, params: tgData) => {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
}

sendTelegramCommand("sendMessage", { chat_id: "143845427", text: "Hello World!" });