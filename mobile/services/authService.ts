import { API_URL } from '../lib/api'

import type {
  AuthResponse,
  User,
} from '../types/auth'

interface ErrorResponse {
  message?: string
}

async function readJson<T>(
  response: Response,
): Promise<T> {
  return (await response.json()) as T
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

  const data =
    await readJson<
      AuthResponse | ErrorResponse
    >(response)

  if (!response.ok) {
    const errorData =
      data as ErrorResponse

    throw new Error(
      errorData.message ||
        'Login failed',
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

  const data = await readJson<{
    user?: User
    message?: string
  }>(response)

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Registration failed',
    )
  }

  if (!data.user) {
    throw new Error(
      'Invalid registration response',
    )
  }

  return data.user
}