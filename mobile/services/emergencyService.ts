import { apiFetch } from '../lib/api'

import type {
  Emergency,
  EmergencyType,
  EmergencyWithContacts,
} from '../types/emergency'

interface CreateEmergencyInput {
  type: EmergencyType
  description: string
  latitude: number
  longitude: number

  aiService?: string
  aiSummary?: string
  aiUrgency?: string
  aiImportantDetails?: string
}

interface ErrorResponse {
  message?: string
}

async function readJson<T>(
  response: Response,
): Promise<T> {
  return (await response.json()) as T
}

export async function createEmergency(
  input: CreateEmergencyInput,
): Promise<Emergency> {
  const response = await apiFetch(
    '/emergencies',
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
  )

  const data = await readJson<{
    emergency?: Emergency
    message?: string
  }>(response)

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Could not send emergency request',
    )
  }

  if (!data.emergency) {
    throw new Error(
      'Invalid response from emergency server',
    )
  }

  return data.emergency
}

export async function getEmergency(
  emergencyId: number,
): Promise<EmergencyWithContacts> {
  const response = await apiFetch(
    `/emergencies/${emergencyId}`,
  )

  const data = await readJson<{
    emergency?: EmergencyWithContacts
    message?: string
  }>(response)

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Could not load emergency request',
    )
  }

  if (!data.emergency) {
    throw new Error(
      'Emergency request not found',
    )
  }

  return data.emergency
}

export async function getEmergencies(): Promise<
  Emergency[]
> {
  const response = await apiFetch(
    '/emergencies',
  )

  const data = await readJson<{
    emergencies?: Emergency[]
    message?: string
  }>(response)

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Could not load emergency history',
    )
  }

  return data.emergencies ?? []
}