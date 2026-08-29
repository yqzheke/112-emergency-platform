export type AIChatRole =
  | 'user'
  | 'assistant'

export type SuggestedEmergencyService =
  | 'MEDICAL'
  | 'POLICE'
  | 'FIRE'
  | null

export interface AIChatHistoryMessage {
  role: AIChatRole
  text: string
}

export interface AIChatResult {
  reply: string

  emergencyRecommended: boolean

  suggestedService:
    SuggestedEmergencyService

  actionLabel: string | null
}

export interface AIChatResponse {
  result: AIChatResult
}