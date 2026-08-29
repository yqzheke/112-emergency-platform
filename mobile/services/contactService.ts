import { apiFetch } from '../lib/api'

import type { Contact } from '../types/contact'

interface ErrorResponse {
  message?: string
}

async function readJson<T>(
  response: Response,
): Promise<T> {
  return (await response.json()) as T
}

export async function getContacts(): Promise<
  Contact[]
> {
  const response = await apiFetch(
    '/contacts',
  )

  const data = await readJson<{
    contacts?: Contact[]
    message?: string
  }>(response)

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
  const response = await apiFetch(
    '/contacts',
    {
      method: 'POST',
      body: JSON.stringify({
        name,
        phone,
      }),
    },
  )

  const data = await readJson<{
    contact?: Contact
    message?: string
  }>(response)

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
  const response = await apiFetch(
    `/contacts/${contactId}`,
    {
      method: 'DELETE',
    },
  )

  const data =
    await readJson<ErrorResponse>(
      response,
    )

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Could not delete emergency contact',
    )
  }
}