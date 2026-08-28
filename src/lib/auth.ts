import type { User } from '../types/auth'

export function getStoredUser(): User | null {
  const storedUser = localStorage.getItem('user')

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser) as User
  } catch {
    return null
  }
}

export function clearAuth(): void {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export function getHomeRoute(user: User): string {
  if (
    user.role === 'OPERATOR' ||
    user.role === 'ADMIN'
  ) {
    return '/operator'
  }

  return '/dashboard'
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
      Math.ceil(normalized.length / 4) * 4,
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

    return decoded.exp * 1000 <= Date.now()
  } catch {
    return true
  }
}