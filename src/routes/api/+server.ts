import type { RequestHandler } from './$types';

import * as dotenv from 'dotenv';

dotenv.config();

// let api: ChatGPTAPIBrowser | null = null;

// async function setupAPI() {
//   console.log('setting up api')
//   api = new ChatGPTAPIBrowser({
//     email: process.env.CHATGPT_EMAIL as string,
//     password: process.env.CHATGPT_PASSWORD as string,
//   })
//   api.initSession()
// }

export const GET = (async ({ url }) => {
  return new Response(JSON.stringify({ res: 'fake response' }));
}) satisfies RequestHandler;