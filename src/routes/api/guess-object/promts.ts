import { TARGET } from '$lib/constants'

function applyPromptTemplate(q: string) {
  return `
請用"是/否/不一定"來回答以下問題。如果問題不是是非題，請回答"無法回答"。請在答案之後將你的解釋寫在小括號內。

問題："狗"是種動物嗎？
回答：是(因為狗屬於動物)

問題："蘋果"是紅色的嗎？
回答：不一定(因為蘋果有可能是其他顏色)

問題："氣球"是什麼顏色的？
回答：無法回答(問題不是是非題)

問題：${q}
回答：
`
}

export function getPromptFromQuestion(q: string, targetAnswer: string) {
  if (!q.includes(TARGET)) throw new Error(`question must contain ${TARGET}`)
  if (q.endsWith('?') || q.endsWith("？")) q = q.slice(0, -1);
  q = q.replace(TARGET, `"${targetAnswer}"`)
  return applyPromptTemplate(q)
}

export function parseResponse(res: string) {
  const re = /(是|否|不一定|無法回答)\((.*)\)/
  const match = re.exec(res);
  return { answer: match?.[1], reason: match?.[2] }
}