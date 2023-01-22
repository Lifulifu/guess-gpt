import type { RequestHandler } from '../$types';
import { error } from '@sveltejs/kit';

import chatgpt from '../../../hooks.server';
import { getPromptFromQuestion, parseResponse } from './promts';

export const GET = (async ({ url }) => {
  if (!chatgpt.status.success) {
    throw error(503, "api is now not available")
  }
  const q = url.searchParams.get('q') as string;
  const target = url.searchParams.get('target') as string;
  if (!q || !target) throw error(500, "missing necessary params.")
  console.log(`request: q=${q}, target=${target}`)

  try {
    const prompt = getPromptFromQuestion(q, target)
    const { response, apiIdx } = await chatgpt.sendMessage(prompt)
    console.log(`response: ${response}, apiIdx: ${apiIdx}`)
    const { answer, reason } = parseResponse(response)
    if (!answer) throw error(500, "error parsing response from chatgpt")
    return new Response(JSON.stringify({ response, answer, reason }));
  } catch (e) {
    throw error(500, "error sending message to chatgpt")
  }
}) satisfies RequestHandler;
