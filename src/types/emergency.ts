import type { Contact } from './contact'
import type { User } from './auth'

export type EmergencyType =
  | 'MEDICAL'
  | 'POLICE'
  | 'FIRE'

export type EmergencyStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'DISPATCHED'
  | 'RESPONDING'
  | 'COMPLETED'
  | 'CANCELLED'

export type EmergencyUser = Pick<
  User,
  'id' | 'fullName' | 'email'
>

export type ResponderUser = Pick<
  User,
  'id' | 'fullName' | 'email' | 'role'
>

export interface Emergency {
  id: number

  type: EmergencyType
  description: string

  latitude: number
  longitude: number

  status: EmergencyStatus

  aiService: string | null
  aiSummary: string | null
  aiUrgency: string | null
  aiImportantDetails: string | null

  assignedResponderId: number | null
  assignedResponder: ResponderUser | null

  responderLatitude: number | null
  responderLongitude: number | null

  responderLocationUpdatedAt: string | null
  responderAssignedAt: string | null
  responderAcceptedAt: string | null
  responderArrivedAt: string | null

  createdAt: string
  updatedAt: string

  userId: number
}

export interface EmergencyWithContacts
  extends Emergency {
  notifiedContacts: Contact[]
}

export interface OperatorEmergency
  extends EmergencyWithContacts {
  user: EmergencyUser
}