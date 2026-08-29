import { apiFetch } from '../lib/api'

import type { EmergencyAIAnalysis } from '../types/ai'

async function readJson<T>(
  response: Response,
): Promise<T> {
  return (await response.json()) as T
}

export async function analyzeEmergency(
  description: string,
): Promise<EmergencyAIAnalysis> {
  const response = await apiFetch(
    '/ai/emergency-assist',
    {
      method: 'POST',
      body: JSON.stringify({
        description,
      }),
    },
  )

  const data = await readJson<{
    analysis?: EmergencyAIAnalysis
    message?: string
  }>(response)

  if (!response.ok) {
    throw new Error(
      data.message ||
        'AI analysis is unavailable',
    )
  }

  if (!data.analysis) {
    throw new Error(
      'AI returned an invalid response',
    )
  }

  return data.analysis
}