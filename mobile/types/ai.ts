export type AISuggestedService =
  | 'MEDICAL'
  | 'POLICE'
  | 'FIRE'
  | 'UNCLEAR'

export type AIUrgency =
  | 'STANDARD'
  | 'URGENT'
  | 'CRITICAL'
  | 'UNCLEAR'

export interface EmergencyAIAnalysis {
  service: AISuggestedService
  summary: string
  importantDetails: string[]
  urgency: AIUrgency
  followUpQuestion: string | null
}