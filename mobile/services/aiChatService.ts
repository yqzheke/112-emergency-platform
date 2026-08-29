import { apiFetch } from '../lib/api'

import type {
  AIChatHistoryMessage,
  AIChatResponse,
  AIChatResult,
} from '../types/aiChat'

export async function sendAIChatMessage(
  message: string,
  history: AIChatHistoryMessage[],
): Promise<AIChatResult> {
  const response =
    await apiFetch('/ai/chat', {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        message,
        history,
      }),
    })

  const data =
    (await response.json()) as
      | AIChatResponse
      | {
          message?: string
        }

  if (!response.ok) {
    throw new Error(
      'message' in data &&
      typeof data.message === 'string'
        ? data.message
        : '112 AI is unavailable',
    )
  }

  if (
    !('result' in data) ||
    !data.result
  ) {
    throw new Error(
      '112 AI returned an invalid response',
    )
  }

  return data.result
}