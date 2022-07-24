import fetch from 'node-fetch';

export const sendMessage = async (clientId: string, text: string) => {
  const botApiUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_SECRET}`;
  const data = { chat_id: clientId, text: "Test: " + text };
  const url = `${botApiUrl}/sendMessage`;
  
  await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  });
}
