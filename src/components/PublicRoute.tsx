import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import {
  clearAuth,
  getHomeRoute,
  getStoredUser,
  isTokenExpired,
} from '../lib/auth'

interface PublicRouteProps {
  children: ReactNode
}

function PublicRoute({
  children,
}: PublicRouteProps) {
  const token = localStorage.getItem('token')
  const user = getStoredUser()

  const hasAuthData = Boolean(token && user)

  if (!hasAuthData) {
    return children
  }

  if (!token || !user) {
    return children
  }

  if (isTokenExpired(token)) {
    clearAuth()
    return children
  }

  return (
    <Navigate
      to={getHomeRoute(user)}
      replace
    />
  )
}

export default PublicRoute