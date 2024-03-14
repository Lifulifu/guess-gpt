import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { TARGET_PLACEHOLDER } from './constants';

export class GuessGptCore {
  private apikey: string;
  private model: ChatOpenAI;
  private prompt: any[];

  constructor(apikey: string = "") {
    this.apikey = apikey;
    this.model = new ChatOpenAI({
      openAIApiKey: this.apikey,
      modelName: 'gpt-3.5-turbo',
      temperature: 0
    });
    this.prompt = [
      new SystemMessage('請基於常識回答問題。請用 [YES, NO, MAYBE, ERROR] 來回答。如果該問題無法以二元的 YES, NO 回答，則回答 MAYBE，若有其他無法回答的情況，請回答 ERROR。請寫出你選擇這個答案的理由。'),

      new HumanMessage('『狗』是種動物嗎？'),
      new AIMessage('YES（狗屬於動物界）'),

      new HumanMessage('『蘋果』是紅色的嗎'),
      new AIMessage('MAYBE（蘋果也有可能是綠色、黃色等其他顏色）'),

      new HumanMessage('『桌子』是食物嗎?'),
      new AIMessage('NO（桌子通常不會被視為食物）'),

      new HumanMessage('『氣球』是什麼形狀的？'),
      new AIMessage('ERROR（問題並非是非題）')
    ];
  }

  public async ask(question: string, target: string): Promise<{ answer: string, reason: string; }> {
    question = question.replaceAll('\n', '');
    question = question.replaceAll(TARGET_PLACEHOLDER, target);
    const output = await this.model.invoke([
      ...this.prompt, new HumanMessage(question)
    ]);
    const message = output.content.toString();
    console.log(question);
    console.log(message);
    return this.parseOutput(message);
  }

  private parseOutput(output: string): { answer: string, reason: string; } {
    const re = /^(YES|NO|MAYBE|ERROR)（(.*)）$/;
    const match = re.exec(output);
    return { answer: match?.[1], reason: match?.[2] };
  }

};