import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import {
  clearAuth,
  getStoredUser,
  isTokenExpired,
} from '../lib/auth'

interface ProtectedRouteProps {
  children: ReactNode
}

function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const token = localStorage.getItem('token')
  const user = getStoredUser()

  const isAuthenticated =
    token &&
    user &&
    !isTokenExpired(token)

  if (!isAuthenticated) {
    clearAuth()

    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  if (
    user.role === 'OPERATOR' ||
    user.role === 'ADMIN'
  ) {
    return (
      <Navigate
        to="/operator"
        replace
      />
    )
  }

  return children
}

export default ProtectedRoute