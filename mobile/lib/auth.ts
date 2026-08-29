import * as SecureStore from 'expo-secure-store'

import type { User } from '../types/auth'

const TOKEN_KEY = 'authToken'
const USER_KEY = 'authUser'

export async function saveAuth(
  token: string,
  user: User,
) {
  await SecureStore.setItemAsync(
    TOKEN_KEY,
    token,
  )

  await SecureStore.setItemAsync(
    USER_KEY,
    JSON.stringify(user),
  )
}

export async function getToken() {
  return SecureStore.getItemAsync(
    TOKEN_KEY,
  )
}

export async function getStoredUser():
  Promise<User | null> {
  const storedUser =
    await SecureStore.getItemAsync(
      USER_KEY,
    )

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(
      storedUser,
    ) as User
  } catch {
    return null
  }
}

export async function clearAuth() {
  await SecureStore.deleteItemAsync(
    TOKEN_KEY,
  )

  await SecureStore.deleteItemAsync(
    USER_KEY,
  )
}

export function isTokenExpired(
  token: string,
): boolean {
  try {
    const parts = token.split('.')

    if (parts.length !== 3) {
      return true
    }

    const payload = parts[1]

    if (!payload) {
      return true
    }

    const normalized = payload
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const padded = normalized.padEnd(
      Math.ceil(
        normalized.length / 4,
      ) * 4,
      '=',
    )

    const decoded = JSON.parse(
      atob(padded),
    ) as {
      exp?: number
    }

    if (
      typeof decoded.exp !== 'number'
    ) {
      return true
    }

    return (
      decoded.exp * 1000 <= Date.now()
    )
  } catch {
    return true
  }
}

export async function getValidToken():
  Promise<string | null> {
  const token = await getToken()

  if (!token) {
    return null
  }

  if (isTokenExpired(token)) {
    await clearAuth()

    return null
  }

  return token
}