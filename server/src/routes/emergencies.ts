import { Router } from 'express'
import prisma from '../lib/prisma'
import {
  requireAuth,
  type AuthRequest,
} from '../middleware/auth'

const router = Router()

const validTypes = [
  'MEDICAL',
  'POLICE',
  'FIRE',
]

router.post(
  '/',
  requireAuth,
  async (req: AuthRequest, res) => {
    try {
      const {
  type,
  description,
  latitude,
  longitude,

  aiService,
  aiSummary,
  aiUrgency,
  aiImportantDetails,
} = req.body

      if (
        !type ||
        !description ||
        latitude === undefined ||
        longitude === undefined
      ) {
        return res.status(400).json({
          message: 'Emergency information is incomplete',
        })
      }

      if (!validTypes.includes(type)) {
        return res.status(400).json({
          message: 'Invalid emergency type',
        })
      }

      if (!req.userId) {
        return res.status(401).json({
          message: 'Authentication required',
        })
      }
      const emergencyContacts =
  await prisma.emergencyContact.findMany({
    where: {
      userId: req.userId,
    },
  })
      const emergency =
  await prisma.emergencyRequest.create({
    data: {
      type,
      description: description.trim(),
      latitude: Number(latitude),
      longitude: Number(longitude),
      userId: req.userId,
      aiService:
  typeof aiService === 'string' &&
  aiService.trim()
    ? aiService.trim()
    : null,

aiSummary:
  typeof aiSummary === 'string' &&
  aiSummary.trim()
    ? aiSummary.trim()
    : null,

aiUrgency:
  typeof aiUrgency === 'string' &&
  aiUrgency.trim()
    ? aiUrgency.trim()
    : null,

aiImportantDetails:
  typeof aiImportantDetails === 'string' &&
  aiImportantDetails.trim()
    ? aiImportantDetails.trim()
    : null,

      notifiedContacts: {
        create: emergencyContacts.map(
          (contact) => ({
            name: contact.name,
            phone: contact.phone,
          }),
        ),
      },
    },

    include: {
      notifiedContacts: true,
    },
  })

      return res.status(201).json({
        message: 'Emergency request created',
        emergency,
      })
    } catch (error) {
      console.error('Emergency creation error:', error)

      return res.status(500).json({
        message: 'Internal server error',
      })
    }
  },
)
router.get(
  '/',
  requireAuth,
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
            userId: req.userId,
          },

          orderBy: {
            createdAt: 'desc',
          },
        })

      return res.json({
        emergencies,
      })
    } catch (error) {
      console.error(
        'Emergency history error:',
        error,
      )

      return res.status(500).json({
        message: 'Internal server error',
      })
    }
  },
)
router.get(
  '/:id',
  requireAuth,
  async (req: AuthRequest, res) => {
    try {
      const emergencyId = Number(req.params.id)

      if (
        !req.userId ||
        !Number.isInteger(emergencyId)
      ) {
        return res.status(400).json({
          message: 'Invalid emergency request',
        })
      }

      const emergency =
  await prisma.emergencyRequest.findFirst({
    where: {
      id: emergencyId,
      userId: req.userId,
    },

    include: {
      notifiedContacts: true,
    },
  })

      if (!emergency) {
        return res.status(404).json({
          message: 'Emergency request not found',
        })
      }

      return res.json({
        emergency,
      })
    } catch (error) {
      console.error(
        'Emergency loading error:',
        error,
      )

      return res.status(500).json({
        message: 'Internal server error',
      })
    }
  },
)

export default router