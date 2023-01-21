import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';

import type { ChatGPTAPIBrowser } from 'chatgpt';
import chatgpt from '../../hooks.server';

export const GET = (async ({ url }) => {
  if (!chatgpt.api) {
    throw error(500, "error setting up chatgpt API")
  }
  const api = chatgpt.api as ChatGPTAPIBrowser;

  const q = url.searchParams.get('q') as string;
  if (!q) return new Response(JSON.stringify({ response: "" }))

  try {
    const res = await api.sendMessage(q)
    return new Response(JSON.stringify({ response: res.response }));
  } catch (e) {
    throw error(500, "error sending message to chatgpt")
  }
}) satisfies RequestHandler;
