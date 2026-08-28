import { Router } from 'express'
import prisma from '../lib/prisma'
import {
  requireAuth,
  type AuthRequest,
} from '../middleware/auth'

const router = Router()

router.use(requireAuth)

router.get(
  '/',
  async (req: AuthRequest, res) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          message: 'Authentication required',
        })
      }

      const contacts =
        await prisma.emergencyContact.findMany({
          where: {
            userId: req.userId,
          },

          orderBy: {
            createdAt: 'desc',
          },
        })

      return res.json({
        contacts,
      })
    } catch (error) {
      console.error(
        'Emergency contacts loading error:',
        error,
      )

      return res.status(500).json({
        message: 'Internal server error',
      })
    }
  },
)

router.post(
  '/',
  async (req: AuthRequest, res) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          message: 'Authentication required',
        })
      }

      const { name, phone } = req.body

      if (!name?.trim() || !phone?.trim()) {
        return res.status(400).json({
          message: 'Name and phone number are required',
        })
      }

      const cleanPhone = phone.trim()

      const validPhone =
        /^[+()\d\s-]{5,30}$/.test(cleanPhone)

      if (!validPhone) {
        return res.status(400).json({
          message: 'Please enter a valid phone number',
        })
      }

      const existingContact =
        await prisma.emergencyContact.findFirst({
          where: {
            userId: req.userId,
            phone: cleanPhone,
          },
        })

      if (existingContact) {
        return res.status(409).json({
          message:
            'A contact with this phone number already exists',
        })
      }

      const contact =
        await prisma.emergencyContact.create({
          data: {
            name: name.trim(),
            phone: cleanPhone,
            userId: req.userId,
          },
        })

      return res.status(201).json({
        message: 'Emergency contact added',
        contact,
      })
    } catch (error) {
      console.error(
        'Emergency contact creation error:',
        error,
      )

      return res.status(500).json({
        message: 'Internal server error',
      })
    }
  },
)

router.delete(
  '/:id',
  async (req: AuthRequest, res) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          message: 'Authentication required',
        })
      }

      const contactId = Number(req.params.id)

      if (!Number.isInteger(contactId)) {
        return res.status(400).json({
          message: 'Invalid contact ID',
        })
      }

      const result =
        await prisma.emergencyContact.deleteMany({
          where: {
            id: contactId,
            userId: req.userId,
          },
        })

      if (result.count === 0) {
        return res.status(404).json({
          message: 'Emergency contact not found',
        })
      }

      return res.json({
        message: 'Emergency contact deleted',
      })
    } catch (error) {
      console.error(
        'Emergency contact deletion error:',
        error,
      )

      return res.status(500).json({
        message: 'Internal server error',
      })
    }
  },
)

export default router