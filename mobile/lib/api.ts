import { router } from 'expo-router'

import {
  clearAuth,
  getValidToken,
} from './auth'

export const API_URL =
  'https://one12-emergency-platform.onrender.com/api'

export class AuthenticationError extends Error {
  constructor(
    message = 'Your session has expired. Please sign in again.',
  ) {
    super(message)

    this.name =
      'AuthenticationError'
  }
}

async function handleUnauthorized():
  Promise<never> {
  await clearAuth()

  router.replace('/login')

  throw new AuthenticationError()
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
) {
  const token =
    await getValidToken()

  if (!token) {
    return handleUnauthorized()
  }

  const headers = new Headers(
    options.headers,
  )

  headers.set(
    'Authorization',
    `Bearer ${token}`,
  )

  if (
    options.body &&
    !headers.has('Content-Type')
  ) {
    headers.set(
      'Content-Type',
      'application/json',
    )
  }

  try {
    const response = await fetch(
      `${API_URL}${path}`,
      {
        ...options,
        headers,
      },
    )

    if (response.status === 401) {
      return handleUnauthorized()
    }

    return response
  } catch (error) {
    console.error(
      `API request failed: ${path}`,
      error,
    )

    throw error
  }
}