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

/*
  --------------------------------------------------
  EMERGENCY INTAKE AI
  --------------------------------------------------
*/

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

/*
  --------------------------------------------------
  112 AI CHAT
  --------------------------------------------------
*/

interface ChatHistoryMessage {
  role: 'user' | 'assistant'
  text: string
}

router.post(
  '/chat',
  requireAuth,
  async (req, res) => {
    try {
      const {
        message,
        history,
      } = req.body

      const cleanMessage =
        typeof message === 'string'
          ? message.trim()
          : ''

      if (!cleanMessage) {
        return res.status(400).json({
          message:
            'Chat message is required',
        })
      }

      if (cleanMessage.length > 1500) {
        return res.status(400).json({
          message:
            'Chat message is too long',
        })
      }

      /*
        Only accept a small amount of previous
        conversation so requests stay fast and
        inexpensive.
      */

      const cleanHistory:
        ChatHistoryMessage[] =
        Array.isArray(history)
          ? history
              .filter(
                (
                  item,
                ): item is ChatHistoryMessage =>
                  item != null &&
                  typeof item ===
                    'object' &&
                  (
                    item.role ===
                      'user' ||
                    item.role ===
                      'assistant'
                  ) &&
                  typeof item.text ===
                    'string',
              )
              .slice(-6)
              .map((item) => ({
                role: item.role,
                text: item.text
                  .trim()
                  .slice(0, 1500),
              }))
          : []

      const historyText =
        cleanHistory.length > 0
          ? cleanHistory
              .map(
                (item) =>
                  `${item.role.toUpperCase()}: ${item.text}`,
              )
              .join('\n')
          : 'No previous conversation.'

      const prompt = `
You are "112 AI", a friendly safety and
emergency-assistance chatbot inside the
112 emergency-response mobile app.

Speak naturally, clearly, and calmly.
Chat with the user like a helpful assistant,
not like an emergency classification system.

You can help with:

- general safety questions
- first-aid guidance
- emergency preparedness
- understanding Medical, Police, and
  Fire & Rescue services
- helping users describe an emergency
- explaining how to use the 112 app
- general questions related to safety
  and emergencies

FIRST-AID GUIDANCE:

You may provide clear, practical,
step-by-step basic first-aid guidance.

Examples include:
- what to do if someone is unconscious
- what to do if someone is not breathing
- basic CPR guidance
- using an AED
- choking first aid
- burns
- bleeding
- fainting
- seizures
- other common emergency situations

When giving first-aid guidance:

- Give simple steps in the correct order.
- Keep instructions easy to follow under stress.
- Encourage contacting emergency services
  immediately for serious situations.
- Tell the user to follow instructions from
  an emergency dispatcher when available.
- Recommend using an AED when appropriate
  and following the AED's instructions.
- Do not diagnose medical conditions.
- Do not prescribe medication.
- Do not invent information about the patient.
- If you are uncertain, say so.
- Do not delay emergency assistance by asking
  unnecessary questions.

SERIOUS EMERGENCIES:

If the situation may involve immediate danger,
such as:
- someone not breathing normally
- unconsciousness
- severe injury
- serious bleeding
- fire
- immediate threat or violence

tell the user clearly that this may be an
emergency and that they should submit an
emergency request through the app or contact
local emergency services immediately.

You cannot personally dispatch an ambulance,
police unit, or fire service.

Never say that emergency services have been
contacted unless the app actually performed
that action.

When appropriate, set:
emergencyRecommended = true

and choose:
MEDICAL
POLICE
or
FIRE

as suggestedService.

CONVERSATION STYLE:

- Be friendly and human.
- Answer normal follow-up questions.
- Remember the recent conversation.
- Avoid robotic phrases.
- Use short paragraphs or numbered steps when
  instructions are easier to understand that way.
- Keep most answers reasonably concise.
- Explain something in more detail if the user asks.
- Do not unnecessarily repeat warnings after every
  message.
- Never invent facts.

Conversation history:
${historyText}

Latest user message:
${cleanMessage}

Return JSON only.
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
                reply: {
                  type: 'string',
                },

                emergencyRecommended: {
                  type: 'boolean',
                },

                suggestedService: {
                  type: [
                    'string',
                    'null',
                  ],

                  enum: [
                    'MEDICAL',
                    'POLICE',
                    'FIRE',
                    null,
                  ],
                },

                actionLabel: {
                  type: [
                    'string',
                    'null',
                  ],
                },
              },

              required: [
                'reply',
                'emergencyRecommended',
                'suggestedService',
                'actionLabel',
              ],
            },
          },
        })

      if (!response.text) {
        return res.status(502).json({
          message:
            'AI did not return a response',
        })
      }

      const result =
        JSON.parse(response.text)

      return res.json({
        result,
      })
    } catch (error) {
      console.error(
        'Gemini AI chat error:',
        error,
      )

      return res.status(500).json({
        message:
          '112 AI is temporarily unavailable',
      })
    }
  },
)

export default router