import * as dotenv from 'dotenv';
import { ChatGPTAPIBrowser } from 'chatgpt'
import { ConsoleMessage } from 'puppeteer';

dotenv.config();

class ChatGPT {
  apiPool: ChatGPTAPIBrowser[] = []
  settled = false
  status = { success: 0, fail: 0 }

  constructor() { }

  async initAllAccounts() {
    const emails = process.env.CHATGPT_EMAILS?.split(',') as string[]
    const passwords = process.env.CHATGPT_PASSWORDS?.split(',') as string[]
    const promises = []
    for (let i = 0; i < emails.length; i++) {
      promises.push(this.initWithAccount(emails[i], passwords[i]))
    }
    return Promise.allSettled(promises).then((results) => {
      let success = 0, fail = 0;
      for (const result of results) {
        if (result.status === 'fulfilled') {
          this.apiPool.push(result.value)
          success++
        } else {
          fail++;
        }
      }
      this.settled = true
      this.status = { success, fail }
      console.log(`all chatgpt accounts initialized. success: ${success}, fail: ${fail}`)
    })
  }

  async initWithAccount(email: string, password: string) {
    console.log('setting up chatgpt API with: ' + email)
    const api = new ChatGPTAPIBrowser({
      email: email as string,
      password: password as string,
      isGoogleLogin: true
    })
    await api.initSession()
    return api
  }

  async sendMessage(message: string, timeoutMs: number = 60000) {
    if (this.apiPool.length === 0) {
      throw new Error('no chatgpt account available')
    }
    const index = Math.floor(Math.random() * this.apiPool.length)
    const response = await this.apiPool[index].sendMessage(message, { timeoutMs })
    return { ...response, apiIdx: index }
  }
}

const chatgpt = new ChatGPT()
chatgpt.initAllAccounts()

export default chatgpt