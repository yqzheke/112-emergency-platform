export type AlertSeverity =
  | 'INFO'
  | 'WARNING'
  | 'CRITICAL'

export interface SafetyAlert {
  id: number
  title: string
  message: string
  region: string
  severity: AlertSeverity
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdById: number | null
}