import { API_URL } from '../lib/api'
import { getToken } from '../lib/auth'

import type { EmergencyAIAnalysis } from '../types/ai'

export async function analyzeEmergency(
  description: string,
): Promise<EmergencyAIAnalysis> {
  const token = await getToken()

  if (!token) {
    throw new Error('You are not logged in')
  }

  const response = await fetch(
    `${API_URL}/ai/emergency-assist`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        description,
      }),
    },
  )

  const data = (await response.json()) as {
    analysis?: EmergencyAIAnalysis
    message?: string
  }

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