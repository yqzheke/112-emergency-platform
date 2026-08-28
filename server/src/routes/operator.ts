import { Router } from 'express'

import prisma from '../lib/prisma'

import {
  requireAuth,
  requireOperator,
  type AuthRequest,
} from '../middleware/auth'

import type { EmergencyStatus } from '../../generated/prisma/enums'

const router = Router()

router.use(requireAuth)
router.use(requireOperator)

const allowedStatuses: EmergencyStatus[] = [
  'PENDING',
  'ACCEPTED',
  'DISPATCHED',
  'RESPONDING',
  'COMPLETED',
  'CANCELLED',
]

function isEmergencyStatus(
  value: unknown,
): value is EmergencyStatus {
  return (
    typeof value === 'string' &&
    allowedStatuses.includes(
      value as EmergencyStatus,
    )
  )
}

/*
  GET /api/operator/emergencies
*/
router.get(
  '/emergencies',
  async (_req: AuthRequest, res) => {
    try {
      const emergencies =
        await prisma.emergencyRequest.findMany({
          orderBy: {
            createdAt: 'desc',
          },

          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },

            notifiedContacts: true,

            assignedResponder: {
              select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
              },
            },
          },
        })

      return res.json({
        emergencies,
      })
    } catch (error) {
      console.error(
        'Operator emergency loading error:',
        error,
      )

      return res.status(500).json({
        message: 'Internal server error',
      })
    }
  },
)

/*
  GET /api/operator/responders
*/
router.get(
  '/responders',
  async (_req: AuthRequest, res) => {
    try {
      const responders =
        await prisma.user.findMany({
          where: {
            role: 'RESPONDER',
          },

          orderBy: {
            fullName: 'asc',
          },

          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        })

      return res.json({
        responders,
      })
    } catch (error) {
      console.error(
        'Responder loading error:',
        error,
      )

      return res.status(500).json({
        message:
          'Could not load responders',
      })
    }
  },
)

/*
  PATCH /api/operator/emergencies/:id/assign
*/
router.patch(
  '/emergencies/:id/assign',
  async (req: AuthRequest, res) => {
    try {
      const emergencyId =
        Number(req.params.id)

      const responderId =
        Number(req.body.responderId)

      if (
        !Number.isInteger(emergencyId) ||
        emergencyId <= 0
      ) {
        return res.status(400).json({
          message:
            'Invalid emergency ID',
        })
      }

      if (
        !Number.isInteger(responderId) ||
        responderId <= 0
      ) {
        return res.status(400).json({
          message:
            'Invalid responder ID',
        })
      }

      const emergency =
        await prisma.emergencyRequest.findUnique({
          where: {
            id: emergencyId,
          },
        })

      if (!emergency) {
        return res.status(404).json({
          message:
            'Emergency not found',
        })
      }

      if (
        emergency.status === 'COMPLETED' ||
        emergency.status === 'CANCELLED'
      ) {
        return res.status(400).json({
          message:
            'Cannot assign a responder to a closed emergency',
        })
      }

      const responder =
        await prisma.user.findFirst({
          where: {
            id: responderId,
            role: 'RESPONDER',
          },

          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        })

      if (!responder) {
        return res.status(404).json({
          message:
            'Responder not found',
        })
      }

      const updatedEmergency =
        await prisma.emergencyRequest.update({
          where: {
            id: emergencyId,
          },

          data: {
            assignedResponderId:
              responder.id,

            responderAssignedAt:
              new Date(),

            status:
              emergency.status === 'ACCEPTED'
                ? 'DISPATCHED'
                : emergency.status,
          },

          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },

            notifiedContacts: true,

            assignedResponder: {
              select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
              },
            },
          },
        })

      return res.json({
        message:
          'Responder assigned successfully',

        emergency:
          updatedEmergency,
      })
    } catch (error) {
      console.error(
        'Responder assignment error:',
        error,
      )

      return res.status(500).json({
        message:
          'Could not assign responder',
      })
    }
  },
)

/*
  PATCH /api/operator/emergencies/:id/status
*/
router.patch(
  '/emergencies/:id/status',
  async (req: AuthRequest, res) => {
    try {
      const emergencyId =
        Number(req.params.id)

      const { status } = req.body

      if (
        !Number.isInteger(emergencyId) ||
        emergencyId <= 0
      ) {
        return res.status(400).json({
          message:
            'Invalid emergency ID',
        })
      }

      if (!isEmergencyStatus(status)) {
        return res.status(400).json({
          message:
            'Invalid emergency status',
        })
      }

      const existing =
        await prisma.emergencyRequest.findUnique({
          where: {
            id: emergencyId,
          },
        })

      if (!existing) {
        return res.status(404).json({
          message:
            'Emergency not found',
        })
      }

      const emergency =
        await prisma.emergencyRequest.update({
          where: {
            id: emergencyId,
          },

          data: {
            status,
          },

          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },

            notifiedContacts: true,

            assignedResponder: {
              select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
              },
            },
          },
        })

      return res.json({
        message:
          'Emergency status updated',

        emergency,
      })
    } catch (error) {
      console.error(
        'Emergency status update error:',
        error,
      )

      return res.status(500).json({
        message:
          'Internal server error',
      })
    }
  },
)

export default router