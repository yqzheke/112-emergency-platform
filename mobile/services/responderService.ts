import { apiFetch } from '../lib/api'

import type { Emergency } from '../types/emergency'

interface ResponderEmergency extends Emergency {
  user: {
    id: number
    fullName: string
    email: string
  }

  notifiedContacts: {
    id: number
    name: string
    phone: string
    createdAt: string
  }[]
}

interface EmergencyListResponse {
  emergencies: ResponderEmergency[]
}

interface EmergencyResponse {
  emergency: ResponderEmergency
  message?: string
}

async function readError(
  response: Response,
) {
  try {
    const data = (await response.json()) as {
      message?: string
    }

    return (
      data.message ||
      'Something went wrong.'
    )
  } catch {
    return 'Something went wrong.'
  }
}

export async function getResponderEmergencies(): Promise<
  ResponderEmergency[]
> {
  const response = await apiFetch(
    '/responder/emergencies',
  )

  if (!response.ok) {
    throw new Error(
      await readError(response),
    )
  }

  const data =
    (await response.json()) as EmergencyListResponse

  return data.emergencies ?? []
}

export async function getResponderHistory(): Promise<
  ResponderEmergency[]
> {
  const response = await apiFetch(
    '/responder/history',
  )

  if (!response.ok) {
    throw new Error(
      await readError(response),
    )
  }

  const data =
    (await response.json()) as EmergencyListResponse

  return data.emergencies ?? []
}

export async function getResponderEmergency(
  emergencyId: number,
): Promise<ResponderEmergency> {
  const response = await apiFetch(
    `/responder/emergencies/${emergencyId}`,
  )

  if (!response.ok) {
    throw new Error(
      await readError(response),
    )
  }

  const data =
    (await response.json()) as EmergencyResponse

  return data.emergency
}

export async function acceptResponderEmergency(
  emergencyId: number,
): Promise<ResponderEmergency> {
  const response = await apiFetch(
    `/responder/emergencies/${emergencyId}/accept`,
    {
      method: 'PATCH',
    },
  )

  if (!response.ok) {
    throw new Error(
      await readError(response),
    )
  }

  const data =
    (await response.json()) as EmergencyResponse

  return data.emergency
}

export async function updateResponderLocation(
  emergencyId: number,
  latitude: number,
  longitude: number,
): Promise<ResponderEmergency> {
  const response = await apiFetch(
    `/responder/emergencies/${emergencyId}/location`,
    {
      method: 'PATCH',

      body: JSON.stringify({
        latitude,
        longitude,
      }),
    },
  )

  if (!response.ok) {
    throw new Error(
      await readError(response),
    )
  }

  const data =
    (await response.json()) as EmergencyResponse

  return data.emergency
}

export async function markResponderArrived(
  emergencyId: number,
): Promise<ResponderEmergency> {
  const response = await apiFetch(
    `/responder/emergencies/${emergencyId}/arrive`,
    {
      method: 'PATCH',
    },
  )

  if (!response.ok) {
    throw new Error(
      await readError(response),
    )
  }

  const data =
    (await response.json()) as EmergencyResponse

  return data.emergency
}

export async function completeResponderEmergency(
  emergencyId: number,
): Promise<ResponderEmergency> {
  const response = await apiFetch(
    `/responder/emergencies/${emergencyId}/complete`,
    {
      method: 'PATCH',
    },
  )

  if (!response.ok) {
    throw new Error(
      await readError(response),
    )
  }

  const data =
    (await response.json()) as EmergencyResponse

  return data.emergency
}

export type {
  ResponderEmergency,
}