import { apiFetch } from '../lib/api'

import type { SafetyAlert } from '../types/alert'

async function readJson<T>(
  response: Response,
): Promise<T> {
  return (await response.json()) as T
}

export async function getAlerts(): Promise<
  SafetyAlert[]
> {
  const response = await apiFetch('/alerts')

  const data = await readJson<{
    alerts?: SafetyAlert[]
    message?: string
  }>(response)

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Could not load safety alerts',
    )
  }

  return data.alerts ?? []
}