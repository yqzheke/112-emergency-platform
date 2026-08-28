import { API_URL } from '../lib/api'
import { getToken } from '../lib/auth'

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

export async function createEmergency(
  input: CreateEmergencyInput,
): Promise<Emergency> {
  const token = await getToken()

  if (!token) {
    throw new Error('You are not logged in')
  }

  const response = await fetch(
    `${API_URL}/emergencies`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(input),
    },
  )

  const data = (await response.json()) as {
    emergency?: Emergency
    message?: string
  }

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
  const token = await getToken()

  if (!token) {
    throw new Error('You are not logged in')
  }

  const response = await fetch(
    `${API_URL}/emergencies/${emergencyId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const data = (await response.json()) as {
    emergency?: EmergencyWithContacts
    message?: string
  }

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
  const token = await getToken()

  if (!token) {
    throw new Error('You are not logged in')
  }

  const response = await fetch(
    `${API_URL}/emergencies`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const data = (await response.json()) as {
    emergencies?: Emergency[]
    message?: string
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Could not load emergency history',
    )
  }

  return data.emergencies ?? []
}