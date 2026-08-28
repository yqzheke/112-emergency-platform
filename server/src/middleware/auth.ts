import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export type UserRole =
  | 'USER'
  | 'OPERATOR'
  | 'RESPONDER'
  | 'ADMIN'

export interface AuthRequest extends Request {
  userId?: number
  role?: UserRole
}

interface TokenPayload {
  userId: number
  role: UserRole
}

function isTokenPayload(value: unknown): value is TokenPayload {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  if (!('userId' in value) || !('role' in value)) {
    return false
  }

  const validRoles = [
    'USER',
    'OPERATOR',
    'RESPONDER',
    'ADMIN',
  ]

  return (
    typeof value.userId === 'number' &&
    typeof value.role === 'string' &&
    validRoles.includes(value.role)
  )
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.headers.authorization

  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Authentication required',
    })
  }

  const token = authorization.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      message: 'Authentication required',
    })
  }

  const secret = process.env.JWT_SECRET

  if (!secret) {
    return res.status(500).json({
      message: 'JWT secret is not configured',
    })
  }

  try {
    const decoded: unknown = jwt.verify(token, secret)

    if (!isTokenPayload(decoded)) {
      return res.status(401).json({
        message: 'Invalid token',
      })
    }

    req.userId = decoded.userId
    req.role = decoded.role

    next()
  } catch {
    return res.status(401).json({
      message: 'Invalid or expired token',
    })
  }
}

export function requireOperator(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  if (
    req.role !== 'OPERATOR' &&
    req.role !== 'ADMIN'
  ) {
    return res.status(403).json({
      message: 'Operator access required',
    })
  }

  next()
}