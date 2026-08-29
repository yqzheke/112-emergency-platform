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

const activeResponderStatuses: EmergencyStatus[] = [
  'DISPATCHED',
  'RESPONDING',
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
        message:
          'Internal server error',
      })
    }
  },
)

/*
  GET /api/operator/responders

  Returns responders together with
  their current availability.
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

            assignedEmergencies: {
              where: {
                status: {
                  in: activeResponderStatuses,
                },
              },

              select: {
                id: true,
                status: true,
              },

              take: 1,
            },
          },
        })

      const formattedResponders =
        responders.map(
          ({
            assignedEmergencies,
            ...responder
          }) => {
            const activeEmergency =
              assignedEmergencies[0] ??
              null

            return {
              ...responder,

              isBusy:
                activeEmergency !== null,

              activeEmergencyId:
                activeEmergency?.id ??
                null,

              activeEmergencyStatus:
                activeEmergency?.status ??
                null,
            }
          },
        )

      return res.json({
        responders:
          formattedResponders,
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

  Assigns an available responder.

  A responder cannot be assigned to more
  than one active emergency at a time.
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
        !Number.isInteger(
          emergencyId,
        ) ||
        emergencyId <= 0
      ) {
        return res.status(400).json({
          message:
            'Invalid emergency ID',
        })
      }

      if (
        !Number.isInteger(
          responderId,
        ) ||
        responderId <= 0
      ) {
        return res.status(400).json({
          message:
            'Invalid responder ID',
        })
      }

      /*
        Load emergency.
      */
      const emergency =
        await prisma.emergencyRequest.findUnique({
          where: {
            id: emergencyId,
          },

          select: {
            id: true,
            status: true,
            assignedResponderId:
              true,
          },
        })

      if (!emergency) {
        return res.status(404).json({
          message:
            'Emergency not found',
        })
      }

      /*
        Closed requests cannot receive
        responders.
      */
      if (
        emergency.status ===
          'COMPLETED' ||
        emergency.status ===
          'CANCELLED'
      ) {
        return res.status(400).json({
          message:
            'Cannot assign a responder to a closed emergency',
        })
      }

      /*
        Operator should accept the request
        before dispatching a responder.
      */
      if (
        emergency.status !==
        'ACCEPTED'
      ) {
        return res.status(400).json({
          message:
            'Emergency must be accepted before assigning a responder',
        })
      }

      /*
        Don't silently overwrite an
        existing responder assignment.
      */
      if (
        emergency.assignedResponderId
      ) {
        return res.status(409).json({
          message:
            'This emergency already has an assigned responder',
        })
      }

      /*
        Verify responder account.
      */
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

      /*
        Check whether this responder is
        already handling another active
        emergency.
      */
      const existingAssignment =
        await prisma.emergencyRequest.findFirst({
          where: {
            assignedResponderId:
              responder.id,

            id: {
              not: emergencyId,
            },

            status: {
              in: activeResponderStatuses,
            },
          },

          select: {
            id: true,
            status: true,
          },
        })

      if (existingAssignment) {
        return res.status(409).json({
          message:
            `Responder is already assigned to emergency #${existingAssignment.id}`,
        })
      }

      /*
        Assignment succeeds.

        ACCEPTED → DISPATCHED

        From this point forward the
        responder app controls:
        DISPATCHED → RESPONDING
        RESPONDING → COMPLETED
      */
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

            /*
              Reset responder lifecycle fields
              in case this emergency ever
              receives a fresh assignment.
            */
            responderAcceptedAt:
              null,

            responderArrivedAt:
              null,

            responderLatitude:
              null,

            responderLongitude:
              null,

            responderLocationUpdatedAt:
              null,

            status: 'DISPATCHED',
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
  async (
    req: AuthRequest,
    res,
  ) => {
    try {
      const emergencyId =
        Number(req.params.id)

      const { status } = req.body

      if (
        !Number.isInteger(
          emergencyId,
        ) ||
        emergencyId <= 0
      ) {
        return res.status(400).json({
          message:
            'Invalid emergency ID',
        })
      }

      if (
        !isEmergencyStatus(status)
      ) {
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

      /*
        Once a responder controls the
        emergency lifecycle, the operator
        should not manually move it through
        responder states.
      */
      if (
        existing.assignedResponderId &&
        (
          status === 'DISPATCHED' ||
          status === 'RESPONDING' ||
          status === 'COMPLETED'
        )
      ) {
        return res.status(400).json({
          message:
            'Responder-controlled status cannot be changed manually by the operator',
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

/*
  PATCH /api/operator/emergencies/:id/demo-location

  DEMO ONLY.

  Simulates responder movement toward the
  emergency so the MVP can be demonstrated
  without a second physical responder device.
*/
router.patch(
  '/emergencies/:id/demo-location',
  async (req: AuthRequest, res) => {
    try {
      const emergencyId =
        Number(req.params.id)

      const progress =
        Number(req.body.progress)

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
        !Number.isFinite(progress) ||
        progress < 0 ||
        progress > 1
      ) {
        return res.status(400).json({
          message:
            'Demo progress must be between 0 and 1',
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
        !emergency.assignedResponderId
      ) {
        return res.status(400).json({
          message:
            'Assign a responder before starting demo tracking',
        })
      }

      if (
        emergency.status ===
          'COMPLETED' ||
        emergency.status ===
          'CANCELLED'
      ) {
        return res.status(400).json({
          message:
            'Cannot simulate tracking for a closed emergency',
        })
      }

      /*
        Demo starting point.

        Roughly north-east of the caller.
        As progress approaches 1, the responder
        approaches the emergency coordinates.
      */
      const startLatitude =
        emergency.latitude + 0.012

      const startLongitude =
        emergency.longitude + 0.012

      const responderLatitude =
        startLatitude +
        (emergency.latitude -
          startLatitude) *
          progress

      const responderLongitude =
        startLongitude +
        (emergency.longitude -
          startLongitude) *
          progress

      const arrived =
        progress >= 1

      const updatedEmergency =
        await prisma.emergencyRequest.update({
          where: {
            id: emergencyId,
          },

          data: {
            responderLatitude,

            responderLongitude,

            responderLocationUpdatedAt:
              new Date(),

            responderAcceptedAt:
              emergency.responderAcceptedAt ??
              new Date(),

            responderArrivedAt:
              arrived
                ? emergency.responderArrivedAt ??
                  new Date()
                : null,

            status: 'RESPONDING',
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
        message: arrived
          ? 'Demo responder arrived'
          : 'Demo responder location updated',

        demo: true,

        progress,

        emergency:
          updatedEmergency,
      })
    } catch (error) {
      console.error(
        'Demo responder movement error:',
        error,
      )

      return res.status(500).json({
        message:
          'Could not update demo responder location',
      })
    }
  },
)

export default router