import { API_URL } from '../lib/api'
import { getToken } from '../lib/auth'

import type { SafetyAlert } from '../types/alert'

export async function getAlerts(): Promise<
  SafetyAlert[]
> {
  const token = await getToken()

  if (!token) {
    throw new Error('You are not logged in')
  }

  const response = await fetch(
    `${API_URL}/alerts`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const data = (await response.json()) as {
    alerts?: SafetyAlert[]
    message?: string
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Could not load safety alerts',
    )
  }

  return data.alerts ?? []
}