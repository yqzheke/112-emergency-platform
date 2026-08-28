import { API_URL } from '../lib/api'

import type {
  AuthResponse,
  User,
} from '../types/auth'

interface ErrorResponse {
  message?: string
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        email,
        password,
      }),
    },
  )

  const data = (await response.json()) as
    | AuthResponse
    | ErrorResponse

  if (!response.ok) {
    const errorData = data as ErrorResponse

    throw new Error(
      errorData.message || 'Login failed',
    )
  }

  return data as AuthResponse
}

export async function register(
  fullName: string,
  email: string,
  password: string,
): Promise<User> {
  const response = await fetch(
    `${API_URL}/auth/register`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        fullName,
        email,
        password,
      }),
    },
  )

  const data = (await response.json()) as {
    user?: User
    message?: string
  }

  if (!response.ok) {
    throw new Error(
      data.message || 'Registration failed',
    )
  }

  if (!data.user) {
    throw new Error(
      'Invalid registration response',
    )
  }

  return data.user
}