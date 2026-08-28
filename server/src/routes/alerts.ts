import { Router } from 'express'

import prisma from '../lib/prisma'

import {
  requireAuth,
  requireOperator,
} from '../middleware/auth'

import type {
  AuthRequest,
} from '../middleware/auth'

const router = Router()

const allowedSeverities = [
  'INFO',
  'WARNING',
  'CRITICAL',
] as const

type AlertSeverity =
  (typeof allowedSeverities)[number]

function isAlertSeverity(
  value: unknown,
): value is AlertSeverity {
  return (
    typeof value === 'string' &&
    allowedSeverities.includes(
      value as AlertSeverity,
    )
  )
}

/*
  GET /api/alerts

  Logged-in users can read active alerts.
*/
router.get(
  '/',
  requireAuth,
  async (_req, res) => {
    try {
      const alerts =
        await prisma.safetyAlert.findMany({
          where: {
            isActive: true,
          },

          orderBy: {
            createdAt: 'desc',
          },
        })

      return res.json({
        alerts,
      })
    } catch (error) {
      console.error(error)

      return res.status(500).json({
        message:
          'Could not load safety alerts',
      })
    }
  },
)

/*
  POST /api/alerts

  Only OPERATOR / ADMIN can publish alerts.
*/
router.post(
  '/',
  requireAuth,
  requireOperator,
  async (req, res) => {
    try {
      const authReq = req as AuthRequest

      const {
        title,
        message,
        region,
        severity,
      } = req.body

      const cleanTitle =
        typeof title === 'string'
          ? title.trim()
          : ''

      const cleanMessage =
        typeof message === 'string'
          ? message.trim()
          : ''

      const cleanRegion =
        typeof region === 'string'
          ? region.trim()
          : ''

      if (!cleanTitle) {
        return res.status(400).json({
          message:
            'Alert title is required',
        })
      }

      if (!cleanMessage) {
        return res.status(400).json({
          message:
            'Alert message is required',
        })
      }

      if (!cleanRegion) {
        return res.status(400).json({
          message:
            'Alert region is required',
        })
      }

      if (!isAlertSeverity(severity)) {
        return res.status(400).json({
          message:
            'Invalid alert severity',
        })
      }

      const alert =
        await prisma.safetyAlert.create({
          data: {
            title: cleanTitle,
            message: cleanMessage,
            region: cleanRegion,
            severity,

            createdById:
              authReq.userId ?? null,
          },
        })

      return res.status(201).json({
        alert,
      })
    } catch (error) {
      console.error(error)

      return res.status(500).json({
        message:
          'Could not create safety alert',
      })
    }
  },
)


router.get(
  '/manage',
  requireAuth,
  requireOperator,
  async (_req, res) => {
    try {
      const alerts =
        await prisma.safetyAlert.findMany({
          orderBy: {
            createdAt: 'desc',
          },
        })

      return res.json({
        alerts,
      })
    } catch (error) {
      console.error(error)

      return res.status(500).json({
        message:
          'Could not load safety alerts',
      })
    }
  },
)
/*
  PATCH /api/alerts/:id

  OPERATOR / ADMIN can activate or deactivate alerts.
*/
router.patch(
  '/:id',
  requireAuth,
  requireOperator,
  async (req, res) => {
    try {
      const alertId =
        Number(req.params.id)

      if (
        !Number.isInteger(alertId) ||
        alertId <= 0
      ) {
        return res.status(400).json({
          message:
            'Invalid alert ID',
        })
      }

      const { isActive } = req.body

      if (typeof isActive !== 'boolean') {
        return res.status(400).json({
          message:
            'isActive must be true or false',
        })
      }

      const existing =
        await prisma.safetyAlert.findUnique({
          where: {
            id: alertId,
          },
        })

      if (!existing) {
        return res.status(404).json({
          message:
            'Safety alert not found',
        })
      }

      const alert =
        await prisma.safetyAlert.update({
          where: {
            id: alertId,
          },

          data: {
            isActive,
          },
        })

      return res.json({
        alert,
      })
    } catch (error) {
      console.error(error)

      return res.status(500).json({
        message:
          'Could not update safety alert',
      })
    }
  },
)

export default router