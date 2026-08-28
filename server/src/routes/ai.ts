import { Router } from 'express'
import { GoogleGenAI } from '@google/genai'

import { requireAuth } from '../middleware/auth'

const router = Router()

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  throw new Error(
    'GEMINI_API_KEY is not configured',
  )
}

const ai = new GoogleGenAI({
  apiKey,
})

router.post(
  '/emergency-assist',
  requireAuth,
  async (req, res) => {
    try {
      const { description } = req.body

      const cleanDescription =
        typeof description === 'string'
          ? description.trim()
          : ''

      if (!cleanDescription) {
        return res.status(400).json({
          message:
            'Emergency description is required',
        })
      }

      if (cleanDescription.length > 1000) {
        return res.status(400).json({
          message:
            'Emergency description is too long',
        })
      }

      const prompt = `
You are an AI emergency-intake assistant
inside a prototype 112 emergency response app.

Analyze ONLY the information supplied by
the caller.

Caller description:
"${cleanDescription}"

Your job:
- identify the most likely emergency service
- create a concise factual operator summary
- extract important reported details
- assign a broad urgency category
- optionally suggest ONE short follow-up question

Rules:
- Do not diagnose medical conditions.
- Do not invent information.
- If information is uncertain, reflect that.
- Do not tell the caller that emergency help
  is unnecessary.
- Never delay or block an emergency request.
- Keep the output concise for an emergency
  operator.
`

      const response =
        await ai.models.generateContent({
          model: 'gemini-3.5-flash-lite',

          contents: prompt,

          config: {
            responseMimeType:
              'application/json',

            responseSchema: {
              type: 'object',

              properties: {
                service: {
                  type: 'string',
                  enum: [
                    'MEDICAL',
                    'POLICE',
                    'FIRE',
                    'UNCLEAR',
                  ],
                },

                summary: {
                  type: 'string',
                },

                importantDetails: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                },

                urgency: {
                  type: 'string',
                  enum: [
                    'STANDARD',
                    'URGENT',
                    'CRITICAL',
                    'UNCLEAR',
                  ],
                },

                followUpQuestion: {
                  type: [
                    'string',
                    'null',
                  ],
                },
              },

              required: [
                'service',
                'summary',
                'importantDetails',
                'urgency',
                'followUpQuestion',
              ],
            },
          },
        })

      if (!response.text) {
        return res.status(502).json({
          message:
            'AI did not return an analysis',
        })
      }

      const analysis =
        JSON.parse(response.text)

      return res.json({
        analysis,
      })
    } catch (error) {
      console.error(
        'Gemini emergency AI error:',
        error,
      )

      return res.status(500).json({
        message:
          'AI emergency analysis is temporarily unavailable',
      })
    }
  },
)

export default router