import * as dotenv from 'dotenv';
import { ChatGPTAPIBrowser } from 'chatgpt'

dotenv.config();

class ChatGPT {
  accounts: { email: string, password: string }[] = []
  apiPool: ChatGPTAPIBrowser[] = []
  settled = false
  status = { success: 0, fail: 0 }

  constructor() { }

  async initAllAccounts() {
    const emails = process.env.CHATGPT_EMAILS?.split(',') as string[]
    const passwords = process.env.CHATGPT_PASSWORDS?.split(',') as string[]
    for (let i = 0; i < emails.length; i++) {
      this.accounts.push({ email: emails[i], password: passwords[i] })
    }
    const promises = this.accounts.map(({ email, password }) => this.initWithAccount(email, password))
    return Promise.allSettled(promises).then((results) => {
      let success = 0, fail = 0;
      for (const result of results) {
        if (result.status === 'fulfilled') {
          const api = result.value
          this.apiPool.push(api)
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
    const api = this.apiPool[index]
    try {
      const response = await api.sendMessage(message, { timeoutMs })
      return { ...response, apiIdx: index }
    } catch (e) {
      console.error(e)
      console.log('refreshing session for account ', index, ', email ', this.accounts[index].email)
      api.refreshSession();
      throw new Error('error getting response from chatgpt')
    }
  }
}

const chatgpt = new ChatGPT()
chatgpt.initAllAccounts()

export default chatgpt