import * as dotenv from 'dotenv';
import { ChatGPTAPIBrowser } from 'chatgpt'

dotenv.config();

class ChatGPT {
  api: ChatGPTAPIBrowser | null = null

  constructor() {
    this.init()
  }

  async init() {
    console.log('setting up chatgpt API')
    const api = new ChatGPTAPIBrowser({
      email: process.env.CHATGPT_EMAIL as string,
      password: process.env.CHATGPT_PASSWORD as string,
      isGoogleLogin: true
    })
    await api.initSession()
    this.api = api;
    console.log('finished setting up chatgpt API')
  }
}

export default new ChatGPT()