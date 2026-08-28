import { Router } from 'express'

import prisma from '../lib/prisma'

import {
  requireAuth,
  type AuthRequest,
} from '../middleware/auth'

const router = Router()

router.use(requireAuth)

function requireResponder(
  req: AuthRequest,
  res: any,
  next: any,
) {
  if (
    req.role !== 'RESPONDER' &&
    req.role !== 'ADMIN'
  ) {
    return res.status(403).json({
      message: 'Responder access required',
    })
  }

  next()
}

router.use(requireResponder)

/*
  GET /api/responder/emergencies

  Returns emergencies assigned to the
  logged-in responder.
*/
router.get(
  '/emergencies',
  async (req: AuthRequest, res) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          message: 'Authentication required',
        })
      }

      const emergencies =
        await prisma.emergencyRequest.findMany({
          where: {
            assignedResponderId: req.userId,

            status: {
              notIn: [
                'COMPLETED',
                'CANCELLED',
              ],
            },
          },

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
          },
        })

      return res.json({
        emergencies,
      })
    } catch (error) {
      console.error(
        'Responder emergency loading error:',
        error,
      )

      return res.status(500).json({
        message:
          'Could not load responder emergencies',
      })
    }
  },
)

/*
  GET /api/responder/emergencies/:id
*/
router.get(
  '/emergencies/:id',
  async (req: AuthRequest, res) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          message: 'Authentication required',
        })
      }

      const emergencyId =
        Number(req.params.id)

      if (
        !Number.isInteger(emergencyId) ||
        emergencyId <= 0
      ) {
        return res.status(400).json({
          message: 'Invalid emergency ID',
        })
      }

      const emergency =
        await prisma.emergencyRequest.findFirst({
          where: {
            id: emergencyId,
            assignedResponderId: req.userId,
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
          },
        })

      if (!emergency) {
        return res.status(404).json({
          message:
            'Assigned emergency not found',
        })
      }

      return res.json({
        emergency,
      })
    } catch (error) {
      console.error(
        'Responder emergency loading error:',
        error,
      )

      return res.status(500).json({
        message:
          'Could not load emergency',
      })
    }
  },
)

/*
  PATCH /api/responder/emergencies/:id/accept

  Responder accepts the assignment.
*/
router.patch(
  '/emergencies/:id/accept',
  async (req: AuthRequest, res) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          message: 'Authentication required',
        })
      }

      const emergencyId =
        Number(req.params.id)

      if (
        !Number.isInteger(emergencyId) ||
        emergencyId <= 0
      ) {
        return res.status(400).json({
          message: 'Invalid emergency ID',
        })
      }

      const existing =
        await prisma.emergencyRequest.findFirst({
          where: {
            id: emergencyId,
            assignedResponderId: req.userId,
          },
        })

      if (!existing) {
        return res.status(404).json({
          message:
            'Assigned emergency not found',
        })
      }

      if (
        existing.status === 'COMPLETED' ||
        existing.status === 'CANCELLED'
      ) {
        return res.status(400).json({
          message:
            'Emergency is already closed',
        })
      }

      const emergency =
        await prisma.emergencyRequest.update({
          where: {
            id: emergencyId,
          },

          data: {
            responderAcceptedAt: new Date(),
            status: 'RESPONDING',
          },
        })

      return res.json({
        message:
          'Emergency assignment accepted',

        emergency,
      })
    } catch (error) {
      console.error(
        'Responder accept error:',
        error,
      )

      return res.status(500).json({
        message:
          'Could not accept emergency',
      })
    }
  },
)

/*
  PATCH /api/responder/emergencies/:id/location

  Responder sends current GPS position.
*/
router.patch(
  '/emergencies/:id/location',
  async (req: AuthRequest, res) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          message: 'Authentication required',
        })
      }

      const emergencyId =
        Number(req.params.id)

      const latitude =
        Number(req.body.latitude)

      const longitude =
        Number(req.body.longitude)

      if (
        !Number.isInteger(emergencyId) ||
        emergencyId <= 0
      ) {
        return res.status(400).json({
          message: 'Invalid emergency ID',
        })
      }

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        return res.status(400).json({
          message:
            'Valid responder location is required',
        })
      }

      const existing =
        await prisma.emergencyRequest.findFirst({
          where: {
            id: emergencyId,
            assignedResponderId: req.userId,
          },
        })

      if (!existing) {
        return res.status(404).json({
          message:
            'Assigned emergency not found',
        })
      }

      const emergency =
        await prisma.emergencyRequest.update({
          where: {
            id: emergencyId,
          },

          data: {
            responderLatitude: latitude,
            responderLongitude: longitude,

            responderLocationUpdatedAt:
              new Date(),
          },
        })

      return res.json({
        message:
          'Responder location updated',

        emergency,
      })
    } catch (error) {
      console.error(
        'Responder location error:',
        error,
      )

      return res.status(500).json({
        message:
          'Could not update responder location',
      })
    }
  },
)

/*
  PATCH /api/responder/emergencies/:id/arrive

  Marks responder as arrived.
*/
router.patch(
  '/emergencies/:id/arrive',
  async (req: AuthRequest, res) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          message: 'Authentication required',
        })
      }

      const emergencyId =
        Number(req.params.id)

      const existing =
        await prisma.emergencyRequest.findFirst({
          where: {
            id: emergencyId,
            assignedResponderId: req.userId,
          },
        })

      if (!existing) {
        return res.status(404).json({
          message:
            'Assigned emergency not found',
        })
      }

      const emergency =
        await prisma.emergencyRequest.update({
          where: {
            id: emergencyId,
          },

          data: {
            responderArrivedAt: new Date(),
          },
        })

      return res.json({
        message: 'Responder arrived',
        emergency,
      })
    } catch (error) {
      console.error(
        'Responder arrival error:',
        error,
      )

      return res.status(500).json({
        message:
          'Could not update responder arrival',
      })
    }
  },
)

/*
  PATCH /api/responder/emergencies/:id/complete
*/
router.patch(
  '/emergencies/:id/complete',
  async (req: AuthRequest, res) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          message: 'Authentication required',
        })
      }

      const emergencyId =
        Number(req.params.id)

      const existing =
        await prisma.emergencyRequest.findFirst({
          where: {
            id: emergencyId,
            assignedResponderId: req.userId,
          },
        })

      if (!existing) {
        return res.status(404).json({
          message:
            'Assigned emergency not found',
        })
      }

      const emergency =
        await prisma.emergencyRequest.update({
          where: {
            id: emergencyId,
          },

          data: {
            status: 'COMPLETED',
          },
        })

      return res.json({
        message:
          'Emergency completed',

        emergency,
      })
    } catch (error) {
      console.error(
        'Responder completion error:',
        error,
      )

      return res.status(500).json({
        message:
          'Could not complete emergency',
      })
    }
  },
)

export default router