import * as dotenv from 'dotenv';
import { ChatGPTAPIBrowser } from 'chatgpt'
import { randomSelect } from '$lib/util';

dotenv.config();

class ChatGPT {
  accounts: { email: string, password: string }[] = []
  apiPool: { api:ChatGPTAPIBrowser, account: string, working: boolean }[] = []
  settled = false

  constructor() { }

  async initAllAccounts() {
    const emails = process.env.CHATGPT_EMAILS?.split(',') as string[]
    const passwords = process.env.CHATGPT_PASSWORDS?.split(',') as string[]
    for (let i = 0; i < emails.length; i++) {
      this.accounts.push({ email: emails[i], password: passwords[i] })
    }
    const promises = this.accounts.map(({ email, password }) => this.initWithAccount(email, password))
    return Promise.allSettled(promises).then((results) => {
      results.forEach((result, i) => {
        if (result.status === 'fulfilled') {
          const api = result.value
          this.apiPool.push({api, account: this.accounts[i].email, working: true})
        } else {
          console.error('error initializing account', result.reason)
        }
      })
      this.settled = true
      console.log(`all chatgpt accounts initialized. success: ${this.apiPool.length} / ${this.accounts.length}`)
    })
  }

  getWorkingApis() {
    return this.apiPool.filter(({working}) => working)
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
    // random index of all working apis
    const index = randomSelect(this.apiPool.map(({working}, i) => (working ? i : -1)).filter((i) => i !== -1))
    const { api, account, working } = this.apiPool[index]
    try {
      const response = await api.sendMessage(message, { timeoutMs })
      if(working === false) console.log(`account ${account} has been recovered.`)
      this.apiPool[index].working = true;
      return { ...response, apiIdx: index }
    } catch (e) {
      console.error(e)
      console.log('refreshing session for account', account)
      this.apiPool[index].working = false;
      api.refreshSession();
      throw new Error('error getting response from chatgpt')
    }
  }
}

let chatgpt: ChatGPT | null = null;
if (import.meta.env.MODE !== 'frontend') {
  chatgpt = new ChatGPT()
  chatgpt.initAllAccounts()
}

export default chatgpt