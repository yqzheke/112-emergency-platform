import { API_URL } from '../lib/api'
import { getToken } from '../lib/auth'

import type { Contact } from '../types/contact'

interface ErrorResponse {
  message?: string
}

async function requireToken() {
  const token = await getToken()

  if (!token) {
    throw new Error('You are not logged in')
  }

  return token
}

export async function getContacts(): Promise<
  Contact[]
> {
  const token = await requireToken()

  const response = await fetch(
    `${API_URL}/contacts`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const data = (await response.json()) as {
    contacts?: Contact[]
    message?: string
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Could not load emergency contacts',
    )
  }

  return data.contacts ?? []
}

export async function createContact(
  name: string,
  phone: string,
): Promise<Contact> {
  const token = await requireToken()

  const response = await fetch(
    `${API_URL}/contacts`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        name,
        phone,
      }),
    },
  )

  const data = (await response.json()) as {
    contact?: Contact
    message?: string
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Could not add emergency contact',
    )
  }

  if (!data.contact) {
    throw new Error(
      'Invalid response from server',
    )
  }

  return data.contact
}

export async function deleteContact(
  contactId: number,
): Promise<void> {
  const token = await requireToken()

  const response = await fetch(
    `${API_URL}/contacts/${contactId}`,
    {
      method: 'DELETE',

      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const data =
    (await response.json()) as ErrorResponse

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Could not delete emergency contact',
    )
  }
}