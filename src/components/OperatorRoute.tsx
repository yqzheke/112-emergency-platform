import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import {
  clearAuth,
  getStoredUser,
  isTokenExpired,
} from '../lib/auth'

interface OperatorRouteProps {
  children: ReactNode
}

function OperatorRoute({
  children,
}: OperatorRouteProps) {
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

  const isOperator =
    user.role === 'OPERATOR' ||
    user.role === 'ADMIN'

  if (!isOperator) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    )
  }

  return children
}

export default OperatorRoute