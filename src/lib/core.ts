import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { TARGET_PLACEHOLDER } from './constants';

export class GuessGptCore {
  private apikey: string;
  private model: OpenAI;
  private inputTemplate: PromptTemplate;

  constructor(apikey: string = "") {
    this.apikey = apikey;
    this.model = new OpenAI({
      openAIApiKey: this.apikey,
      modelName: 'gpt-3.5-turbo',
      temperature: 0
    });

    this.inputTemplate = new PromptTemplate({
      inputVariables: ["question"],
      template: `請基於常識回答下列問題。請用『是/否/不一定』來回答。如果問題不是是非題或者有其他無法回答的情況，請回答『無法回答』。請寫出你選擇這個答案的理由。

問題：『狗』是種動物嗎？
回答：是
理由：狗屬於動物

問題：『桌子』是食物嗎？
回答：否
理由：桌子通常不會被視為食物

問題：『蘋果』是紅色的嗎？
回答：不一定
理由：蘋果有可能是其他顏色

問題：『氣球』是什麼形狀的？
回答：無法回答
理由：問題不是是非題

問題：{question}
回答：`
    });
  }

  public async ask(question: string, target: string): Promise<{ answer: string, reason: string; }> {
    question = question.replaceAll('\n', '');
    question = question.replaceAll(TARGET_PLACEHOLDER, target);
    const input = await this.inputTemplate.format({ question });
    const output = await this.model.call(input);
    console.log(input);
    console.log(output);
    return this.parseOutput(output);
  }

  private parseOutput(output: string): { answer: string, reason: string; } {
    const re = /^(是|否|不一定|無法回答)\n+理由：(.*)/;
    const match = re.exec(output);
    return { answer: match?.[1], reason: match?.[2] };
  }

}