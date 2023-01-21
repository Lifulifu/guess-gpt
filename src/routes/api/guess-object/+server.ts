import type { RequestHandler } from '../$types';
import { error } from '@sveltejs/kit';

import type { ChatGPTAPIBrowser } from 'chatgpt';
import chatgpt from '../../../hooks.server';
import { getPromptFromQuestion, parseResponse } from './promts';

export const GET = (async ({ url }) => {
  if (!chatgpt.api) {
    throw error(500, "error setting up chatgpt API")
  }
  const api = chatgpt.api as ChatGPTAPIBrowser;

  const q = url.searchParams.get('q') as string;
  const target = url.searchParams.get('target') as string;
  if (!q || !target) throw error(500, "missing necessary params.")
  console.log(`request: q=${q}, target=${target}`)

  try {
    const prompt = getPromptFromQuestion(q, target)
    const res = (await api.sendMessage(prompt, { timeoutMs: 2 * 60000 })).response
    console.log(`response: ${res}`)
    const { answer, reason } = parseResponse(res)
    if (!answer) throw error(500, "error parsing response from chatgpt")
    return new Response(JSON.stringify({ res, answer, reason }));
  } catch (e) {
    throw error(500, "error sending message to chatgpt")
  }
}) satisfies RequestHandler;
