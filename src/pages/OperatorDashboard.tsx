import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useNavigate } from 'react-router-dom'

import EmergencyMap from '../components/EmergencyMap'
import SafetyAlertsPanel from '../components/SafetyAlertsPanel'

import { API_URL } from '../lib/api'
import { clearAuth } from '../lib/auth'

import type {
  OperatorEmergency,
  ResponderUser,
} from '../types/emergency'

const emergencyNames: Record<
  OperatorEmergency['type'],
  string
> = {
  MEDICAL: 'Medical',
  POLICE: 'Police',
  FIRE: 'Fire & Rescue',
}

const emergencyCodes: Record<
  OperatorEmergency['type'],
  string
> = {
  MEDICAL: 'MED',
  POLICE: 'POL',
  FIRE: 'FIRE',
}

type IconProps = {
  size?: number
  className?: string
}

function GridIcon({
  size = 18,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  )
}

function EmergencyIcon({
  size = 18,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 3 3.5 20h17L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M12 9v4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy="17"
        r="1"
        fill="currentColor"
      />
    </svg>
  )
}

function ResponderIcon({
  size = 18,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M4.5 21c.7-4.1 3.2-6.2 7.5-6.2s6.8 2.1 7.5 6.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function BellIcon({
  size = 18,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M10 21h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function RefreshIcon({
  size = 17,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20 6v5h-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M19 11a7 7 0 1 0-2 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function LogoutIcon({
  size = 17,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 5H5v14h5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="m14 8 4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M18 12H9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ActivityIcon({
  size = 18,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 12h4l2-6 4 12 2-6h6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CheckIcon({
  size = 18,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ClockIcon({
  size = 18,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function LocationIcon({
  size = 18,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <circle
        cx="12"
        cy="10"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  )
}

function scrollToSection(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
}

function OperatorDashboard() {
  const navigate = useNavigate()

  const [emergencies, setEmergencies] =
    useState<OperatorEmergency[]>([])

  const [responders, setResponders] =
    useState<ResponderUser[]>([])

  const [
    selectedResponders,
    setSelectedResponders,
  ] = useState<
    Record<number, number | null>
  >({})

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [updatingId, setUpdatingId] =
    useState<number | null>(null)

  const [assigningId, setAssigningId] =
    useState<number | null>(null)

  const getToken = () =>
    localStorage.getItem('token')

  const handleUnauthorized =
    useCallback(() => {
      clearAuth()
      navigate('/login')
    }, [navigate])

  const loadEmergencies =
    useCallback(async () => {
      const token = getToken()

      if (!token) {
        handleUnauthorized()
        return
      }

      try {
        const response = await fetch(
          `${API_URL}/operator/emergencies`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        )

        const data =
          (await response.json()) as {
            emergencies?:
              OperatorEmergency[]
            message?: string
          }

        if (response.status === 401) {
          handleUnauthorized()
          return
        }

        if (!response.ok) {
          setError(
            data.message ||
              'Could not load emergencies',
          )

          return
        }

        const nextEmergencies =
          data.emergencies ?? []

        setEmergencies(
          nextEmergencies,
        )

        setSelectedResponders(
          (current) => {
            const next = {
              ...current,
            }

            for (const emergency of
              nextEmergencies) {
              if (
                emergency.assignedResponderId
              ) {
                next[emergency.id] =
                  emergency.assignedResponderId
              }
            }

            return next
          },
        )

        setError('')
      } catch (error) {
        console.error(error)

        setError(
          'Could not connect to the ResQ server',
        )
      } finally {
        setLoading(false)
      }
    }, [handleUnauthorized])

  const loadResponders =
    useCallback(async () => {
      const token = getToken()

      if (!token) {
        handleUnauthorized()
        return
      }

      try {
        const response = await fetch(
          `${API_URL}/operator/responders`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        )

        const data =
          (await response.json()) as {
            responders?: ResponderUser[]
            message?: string
          }

        if (response.status === 401) {
          handleUnauthorized()
          return
        }

        if (!response.ok) {
          setError(
            data.message ||
              'Could not load responders',
          )

          return
        }

        setResponders(
          data.responders ?? [],
        )
      } catch (error) {
        console.error(error)

        setError(
          'Could not load responders',
        )
      }
    }, [handleUnauthorized])

  useEffect(() => {
    loadEmergencies()
    loadResponders()

    const interval =
      window.setInterval(() => {
        loadEmergencies()
      }, 5000)

    return () => {
      window.clearInterval(interval)
    }
  }, [
    loadEmergencies,
    loadResponders,
  ])

  const acceptEmergency = async (
    emergencyId: number,
  ) => {
    const token = getToken()

    if (!token) {
      handleUnauthorized()
      return
    }

    try {
      setUpdatingId(emergencyId)
      setError('')

      const response = await fetch(
        `${API_URL}/operator/emergencies/${emergencyId}/status`,
        {
          method: 'PATCH',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            status: 'ACCEPTED',
          }),
        },
      )

      const data =
        (await response.json()) as {
          message?: string
        }

      if (response.status === 401) {
        handleUnauthorized()
        return
      }

      if (!response.ok) {
        setError(
          data.message ||
            'Could not accept emergency',
        )

        return
      }

      await loadEmergencies()
    } catch (error) {
      console.error(error)

      setError(
        'Could not connect to the ResQ server',
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const assignResponder = async (
    emergencyId: number,
  ) => {
    const responderId =
      selectedResponders[
        emergencyId
      ]

    if (!responderId) {
      setError(
        'Select a responder first.',
      )

      return
    }

    const token = getToken()

    if (!token) {
      handleUnauthorized()
      return
    }

    try {
      setAssigningId(emergencyId)
      setError('')

      const response = await fetch(
        `${API_URL}/operator/emergencies/${emergencyId}/assign`,
        {
          method: 'PATCH',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            responderId,
          }),
        },
      )

      const data =
        (await response.json()) as {
          message?: string
        }

      if (response.status === 401) {
        handleUnauthorized()
        return
      }

      if (!response.ok) {
        setError(
          data.message ||
            'Could not assign responder',
        )

        return
      }

      await loadEmergencies()
      await loadResponders()
    } catch (error) {
      console.error(error)

      setError(
        'Could not assign responder',
      )
    } finally {
      setAssigningId(null)
    }
  }

  const activeEmergencies =
    useMemo(
      () =>
        emergencies.filter(
          (emergency) =>
            emergency.status !==
              'COMPLETED' &&
            emergency.status !==
              'CANCELLED',
        ),
      [emergencies],
    )

  const completedEmergencies =
    useMemo(
      () =>
        emergencies.filter(
          (emergency) =>
            emergency.status ===
              'COMPLETED' ||
            emergency.status ===
              'CANCELLED',
        ),
      [emergencies],
    )

  const pendingCount =
    activeEmergencies.filter(
      (emergency) =>
        emergency.status ===
        'PENDING',
    ).length

  const availableResponders =
    responders.filter(
      (responder) =>
        !responder.isBusy,
    ).length

  const busyResponders =
    responders.length -
    availableResponders

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="resq-control-loading">
        <div className="resq-control-loading-mark">
          R
        </div>

        <div>
          <strong>
            ResQ Control
          </strong>

          <span>
            Initializing emergency
            operations...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="resq-control-shell">
      {/* SIDEBAR */}

      <aside className="resq-sidebar">
        <div className="resq-brand">
          <div className="resq-brand-mark">
            R
          </div>

          <div className="resq-brand-copy">
            <strong>ResQ</strong>

            <span>
              Emergency Control
            </span>
          </div>
        </div>

        <div className="resq-sidebar-status">
          <span className="resq-online-dot" />

          <div>
            <strong>
              Network online
            </strong>

            <span>
              Operations synchronized
            </span>
          </div>
        </div>

        <nav className="resq-nav">
          <span className="resq-nav-label">
            COMMAND
          </span>

          <button
            type="button"
            className="resq-nav-item active"
            onClick={() =>
              scrollToSection(
                'resq-overview',
              )
            }
          >
            <GridIcon />

            <span>
              Overview
            </span>
          </button>

          <button
            type="button"
            className="resq-nav-item"
            onClick={() =>
              scrollToSection(
                'resq-incidents',
              )
            }
          >
            <EmergencyIcon />

            <span>
              Incidents
            </span>

            {activeEmergencies.length >
              0 && (
              <span className="resq-nav-count danger">
                {
                  activeEmergencies.length
                }
              </span>
            )}
          </button>

          <button
            type="button"
            className="resq-nav-item"
            onClick={() =>
              scrollToSection(
                'resq-responders',
              )
            }
          >
            <ResponderIcon />

            <span>
              Responders
            </span>

            <span className="resq-nav-count">
              {availableResponders}
            </span>
          </button>

          <button
            type="button"
            className="resq-nav-item"
            onClick={() =>
              scrollToSection(
                'resq-alerts',
              )
            }
          >
            <BellIcon />

            <span>
              Safety Alerts
            </span>
          </button>
        </nav>

        <div className="resq-sidebar-spacer" />

        <div className="resq-side-system">
          <div className="resq-side-system-top">
            <ActivityIcon />

            <span>
              SYSTEM STATUS
            </span>
          </div>

          <strong>
            Fully operational
          </strong>

          <p>
            Live incident synchronization
            every 5 seconds.
          </p>
        </div>

        <div className="resq-user">
          <div className="resq-user-avatar">
            OP
          </div>

          <div className="resq-user-copy">
            <strong>
              Operator
            </strong>

            <span>
              Control Center
            </span>
          </div>

          <button
            type="button"
            className="resq-logout"
            onClick={handleLogout}
            aria-label="Sign out"
            title="Sign out"
          >
            <LogoutIcon />
          </button>
        </div>
      </aside>

      {/* WORKSPACE */}

      <div className="resq-workspace">
        <header className="resq-topbar">
          <div className="resq-topbar-heading">
            <span>
              RESQ COMMAND CENTER
            </span>

            <h1>
              Emergency Operations
            </h1>
          </div>

          <div className="resq-topbar-actions">
            <div className="resq-live-status">
              <span />

              LIVE
            </div>

            <button
              type="button"
              className="resq-refresh"
              onClick={() => {
                loadEmergencies()
                loadResponders()
              }}
            >
              <RefreshIcon />

              Refresh
            </button>
          </div>
        </header>

        <main className="resq-main">
          {/* OVERVIEW */}

          <section
            id="resq-overview"
            className="resq-overview"
          >
            <div className="resq-overview-header">
              <div>
                <span className="resq-section-eyebrow">
                  OPERATIONAL PICTURE
                </span>

                <h2>
                  Live command overview
                </h2>

                <p>
                  Real-time incident,
                  responder, and dispatch
                  intelligence.
                </p>
              </div>

              <div className="resq-auto-sync">
                <ActivityIcon size={16} />

                Auto sync active
              </div>
            </div>

            <div className="resq-kpi-grid">
              <div className="resq-kpi-card primary">
                <div className="resq-kpi-top">
                  <span>
                    ACTIVE INCIDENTS
                  </span>

                  <div className="resq-kpi-icon">
                    <EmergencyIcon />
                  </div>
                </div>

                <strong>
                  {activeEmergencies.length}
                </strong>

                <p>
                  Open emergency requests
                </p>
              </div>

              <div className="resq-kpi-card warning">
                <div className="resq-kpi-top">
                  <span>
                    AWAITING REVIEW
                  </span>

                  <div className="resq-kpi-icon">
                    <ClockIcon />
                  </div>
                </div>

                <strong>
                  {pendingCount}
                </strong>

                <p>
                  Require operator action
                </p>
              </div>

              <div className="resq-kpi-card success">
                <div className="resq-kpi-top">
                  <span>
                    RESPONDERS READY
                  </span>

                  <div className="resq-kpi-icon">
                    <ResponderIcon />
                  </div>
                </div>

                <strong>
                  {availableResponders}
                </strong>

                <p>
                  {busyResponders} currently
                  engaged
                </p>
              </div>

              <div className="resq-kpi-card neutral">
                <div className="resq-kpi-top">
                  <span>
                    CLOSED INCIDENTS
                  </span>

                  <div className="resq-kpi-icon">
                    <CheckIcon />
                  </div>
                </div>

                <strong>
                  {
                    completedEmergencies.length
                  }
                </strong>

                <p>
                  Completed or cancelled
                </p>
              </div>
            </div>
          </section>

          {error && (
            <div className="resq-error">
              <EmergencyIcon size={17} />

              <span>
                {error}
              </span>
            </div>
          )}

          {/* COMMAND GRID */}

          <div className="resq-command-grid">
            <section
              id="resq-incidents"
              className="resq-incidents"
            >
              <div className="resq-panel-header">
                <div>
                  <span className="resq-section-eyebrow">
                    INCIDENT COMMAND
                  </span>

                  <h2>
                    Live incident queue
                  </h2>

                  <p>
                    Review, accept, dispatch,
                    and monitor emergencies.
                  </p>
                </div>

                <div className="resq-open-pill">
                  <span />

                  {
                    activeEmergencies.length
                  }{' '}
                  ACTIVE
                </div>
              </div>

              {activeEmergencies.length ===
              0 ? (
                <div className="resq-empty-state">
                  <div className="resq-empty-icon">
                    <CheckIcon size={22} />
                  </div>

                  <strong>
                    No active incidents
                  </strong>

                  <span>
                    Incoming requests will
                    appear here automatically.
                  </span>
                </div>
              ) : (
                <div className="resq-incident-list">
                  {activeEmergencies.map(
                    (emergency) => {
                      const responderArrived =
                        Boolean(
                          emergency
                            .responderArrivedAt,
                        )

                      const responderEnRoute =
                        emergency.status ===
                          'RESPONDING' &&
                        !responderArrived

                      return (
                        <article
                          key={emergency.id}
                          className={`resq-incident-card service-${emergency.type.toLowerCase()}`}
                        >
                          <div className="resq-incident-header">
                            <div className="resq-incident-heading">
                              <div className="resq-incident-code">
                                <span>
                                  {
                                    emergencyCodes[
                                      emergency
                                        .type
                                    ]
                                  }
                                </span>

                                <strong>
                                  #
                                  {
                                    emergency.id
                                  }
                                </strong>
                              </div>

                              <div>
                                <span className="resq-incident-kicker">
                                  {
                                    emergencyNames[
                                      emergency
                                        .type
                                    ]
                                  }{' '}
                                  RESPONSE
                                </span>

                                <h3>
                                  {
                                    emergencyNames[
                                      emergency
                                        .type
                                    ]
                                  }{' '}
                                  Emergency
                                </h3>

                                <p>
                                  Received{' '}
                                  {new Date(
                                    emergency.createdAt,
                                  ).toLocaleString()}
                                </p>
                              </div>
                            </div>

                            <span
                              className={`resq-status status-${emergency.status.toLowerCase()}`}
                            >
                              {responderArrived
                                ? 'ON SCENE'
                                : emergency.status}
                            </span>
                          </div>

                          <div className="resq-incident-description">
                            <span>
                              INCIDENT DESCRIPTION
                            </span>

                            <p>
                              {
                                emergency.description
                              }
                            </p>
                          </div>

                          <div className="resq-meta-grid">
                            <div>
                              <span>
                                CALLER
                              </span>

                              <strong>
                                {
                                  emergency
                                    .user
                                    .fullName
                                }
                              </strong>
                            </div>

                            <div>
                              <span>
                                RECEIVED
                              </span>

                              <strong>
                                {new Date(
                                  emergency.createdAt,
                                ).toLocaleTimeString(
                                  [],
                                  {
                                    hour:
                                      '2-digit',
                                    minute:
                                      '2-digit',
                                  },
                                )}
                              </strong>
                            </div>

                            <div>
                              <span>
                                LOCATION
                              </span>

                              <strong>
                                {emergency.latitude.toFixed(
                                  4,
                                )}
                                ,{' '}
                                {emergency.longitude.toFixed(
                                  4,
                                )}
                              </strong>
                            </div>
                          </div>

                          {emergency.aiSummary && (
                            <div className="resq-ai-intelligence">
                              <div className="resq-ai-heading">
                                <div>
                                  <span>
                                    RESQ AI
                                  </span>

                                  <strong>
                                    Incident
                                    intelligence
                                  </strong>
                                </div>

                                <div className="resq-ai-mark">
                                  AI
                                </div>
                              </div>

                              <div className="resq-ai-metrics">
                                <div>
                                  <span>
                                    SERVICE
                                  </span>

                                  <strong>
                                    {emergency.aiService ||
                                      'UNCLEAR'}
                                  </strong>
                                </div>

                                <div>
                                  <span>
                                    URGENCY
                                  </span>

                                  <strong>
                                    {emergency.aiUrgency ||
                                      'UNCLEAR'}
                                  </strong>
                                </div>
                              </div>

                              <div className="resq-ai-summary">
                                <span>
                                  OPERATOR SUMMARY
                                </span>

                                <p>
                                  {
                                    emergency.aiSummary
                                  }
                                </p>
                              </div>

                              {emergency.aiImportantDetails && (
                                <div className="resq-ai-details">
                                  <span>
                                    IMPORTANT DETAILS
                                  </span>

                                  {(() => {
                                    try {
                                      const details =
                                        JSON.parse(
                                          emergency.aiImportantDetails,
                                        ) as string[]

                                      return (
                                        <ul>
                                          {details.map(
                                            (
                                              detail,
                                              index,
                                            ) => (
                                              <li
                                                key={`${detail}-${index}`}
                                              >
                                                {
                                                  detail
                                                }
                                              </li>
                                            ),
                                          )}
                                        </ul>
                                      )
                                    } catch {
                                      return null
                                    }
                                  })()}
                                </div>
                              )}

                              <p className="resq-ai-disclaimer">
                                AI-assisted intake.
                                Operator verification
                                remains required.
                              </p>
                            </div>
                          )}

                          <div className="resq-map-heading">
                            <div>
                              <span>
                                LIVE RESPONSE MAP
                              </span>

                              <strong>
                                Incident &
                                responder tracking
                              </strong>
                            </div>

                            <div className="resq-map-live">
                              <span />

                              LIVE
                            </div>
                          </div>

                          <div className="resq-map-shell">
                            <EmergencyMap
                              latitude={
                                emergency.latitude
                              }
                              longitude={
                                emergency.longitude
                              }
                              responderLatitude={
                                emergency.responderLatitude
                              }
                              responderLongitude={
                                emergency.responderLongitude
                              }
                            />
                          </div>

                          <div className="resq-tracking">
                            <div className="resq-tracking-top">
                              <div>
                                <span
                                  className={`resq-tracking-dot ${
                                    emergency.responderLatitude !=
                                      null &&
                                    emergency.responderLongitude !=
                                      null
                                      ? 'active'
                                      : 'waiting'
                                  }`}
                                />

                                <strong>
                                  {emergency.responderLatitude !=
                                    null &&
                                  emergency.responderLongitude !=
                                    null
                                    ? 'Responder GPS live'
                                    : emergency.assignedResponder
                                      ? 'Waiting for responder GPS'
                                      : 'No responder assigned'}
                                </strong>
                              </div>

                              {emergency.responderLocationUpdatedAt && (
                                <span>
                                  Updated{' '}
                                  {new Date(
                                    emergency.responderLocationUpdatedAt,
                                  ).toLocaleTimeString(
                                    [],
                                    {
                                      hour:
                                        '2-digit',
                                      minute:
                                        '2-digit',
                                      second:
                                        '2-digit',
                                    },
                                  )}
                                </span>
                              )}
                            </div>

                            <div className="resq-map-legend">
                              <div>
                                <span className="resq-legend emergency" />

                                Emergency
                              </div>

                              <div>
                                <span className="resq-legend responder" />

                                Responder
                              </div>
                            </div>
                          </div>

                          <section
                            id="resq-responders"
                            className="resq-dispatch-section"
                          >
                            <div className="resq-dispatch-header">
                              <div>
                                <span>
                                  RESPONDER DISPATCH
                                </span>

                                <strong>
                                  {emergency.assignedResponder
                                    ? responderArrived
                                      ? 'Unit on scene'
                                      : responderEnRoute
                                        ? 'Unit en route'
                                        : 'Unit assigned'
                                    : 'Awaiting responder'}
                                </strong>
                              </div>

                              <ResponderIcon
                                size={20}
                              />
                            </div>

                            {emergency.assignedResponder ? (
                              <div className="resq-assigned-unit">
                                <div className="resq-unit-identity">
                                  <div className="resq-unit-avatar">
                                    {emergency.assignedResponder.fullName
                                      .charAt(0)
                                      .toUpperCase()}
                                  </div>

                                  <div>
                                    <strong>
                                      {
                                        emergency
                                          .assignedResponder
                                          .fullName
                                      }
                                    </strong>

                                    <span>
                                      {
                                        emergency
                                          .assignedResponder
                                          .email
                                      }
                                    </span>
                                  </div>
                                </div>

                                <span className="resq-unit-status">
                                  {responderArrived
                                    ? 'ON SCENE'
                                    : responderEnRoute
                                      ? 'EN ROUTE'
                                      : 'ASSIGNED'}
                                </span>
                              </div>
                            ) : emergency.status ===
                              'ACCEPTED' ? (
                              <div className="resq-assignment-controls">
                                <select
                                  value={
                                    selectedResponders[
                                      emergency
                                        .id
                                    ] ?? ''
                                  }
                                  onChange={(
                                    event,
                                  ) => {
                                    const value =
                                      Number(
                                        event
                                          .target
                                          .value,
                                      )

                                    setSelectedResponders(
                                      (
                                        current,
                                      ) => ({
                                        ...current,

                                        [emergency.id]:
                                          value ||
                                          null,
                                      }),
                                    )
                                  }}
                                >
                                  <option value="">
                                    Select available
                                    responder
                                  </option>

                                  {responders.map(
                                    (
                                      responder,
                                    ) => (
                                      <option
                                        key={
                                          responder.id
                                        }
                                        value={
                                          responder.id
                                        }
                                        disabled={
                                          responder.isBusy
                                        }
                                      >
                                        {responder.isBusy
                                          ? `${responder.fullName} — Busy on #${responder.activeEmergencyId}`
                                          : `${responder.fullName} — Available`}
                                      </option>
                                    ),
                                  )}
                                </select>

                                <button
                                  type="button"
                                  disabled={
                                    !selectedResponders[
                                      emergency
                                        .id
                                    ] ||
                                    assigningId ===
                                      emergency.id
                                  }
                                  onClick={() =>
                                    assignResponder(
                                      emergency.id,
                                    )
                                  }
                                >
                                  {assigningId ===
                                  emergency.id
                                    ? 'Assigning...'
                                    : 'Dispatch responder'}
                                </button>
                              </div>
                            ) : (
                              <p className="resq-dispatch-note">
                                Accept this
                                incident before
                                assigning a
                                responder.
                              </p>
                            )}

                            <div className="resq-response-timeline">
                              {emergency.responderAssignedAt && (
                                <p>
                                  <span />

                                  Assigned{' '}
                                  {new Date(
                                    emergency.responderAssignedAt,
                                  ).toLocaleString()}
                                </p>
                              )}

                              {emergency.responderAcceptedAt && (
                                <p>
                                  <span />

                                  Accepted{' '}
                                  {new Date(
                                    emergency.responderAcceptedAt,
                                  ).toLocaleString()}
                                </p>
                              )}

                              {emergency.responderArrivedAt && (
                                <p>
                                  <span />

                                  Arrived{' '}
                                  {new Date(
                                    emergency.responderArrivedAt,
                                  ).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </section>

                          <div className="resq-contact-section">
                            <div className="resq-contact-heading">
                              <span>
                                EMERGENCY CONTACTS
                              </span>

                              <strong>
                                {
                                  emergency
                                    .notifiedContacts
                                    .length
                                }{' '}
                                attached
                              </strong>
                            </div>

                            {emergency
                              .notifiedContacts
                              .length === 0 ? (
                              <p className="resq-contact-empty">
                                No emergency
                                contacts attached.
                              </p>
                            ) : (
                              <div className="resq-contact-list">
                                {emergency.notifiedContacts.map(
                                  (
                                    contact,
                                  ) => (
                                    <div
                                      key={
                                        contact.id
                                      }
                                      className="resq-contact"
                                    >
                                      <div>
                                        <strong>
                                          {
                                            contact.name
                                          }
                                        </strong>

                                        <span>
                                          {
                                            contact.phone
                                          }
                                        </span>
                                      </div>

                                      <span className="resq-contact-state">
                                        Prepared
                                      </span>
                                    </div>
                                  ),
                                )}
                              </div>
                            )}
                          </div>

                          {emergency.status ===
                            'PENDING' && (
                            <div className="resq-next-action">
                              <div>
                                <span>
                                  NEXT ACTION
                                </span>

                                <strong>
                                  Review and accept
                                  incoming incident
                                </strong>
                              </div>

                              <button
                                type="button"
                                disabled={
                                  updatingId ===
                                  emergency.id
                                }
                                onClick={() =>
                                  acceptEmergency(
                                    emergency.id,
                                  )
                                }
                              >
                                {updatingId ===
                                emergency.id
                                  ? 'Accepting...'
                                  : 'Accept incident'}
                              </button>
                            </div>
                          )}

                          {emergency.status ===
                            'ACCEPTED' &&
                            !emergency.assignedResponder && (
                              <div className="resq-operation-note">
                                ResQ is waiting
                                for a responder to
                                be assigned.
                              </div>
                            )}

                          {emergency.status ===
                            'DISPATCHED' && (
                              <div className="resq-operation-note">
                                Responder dispatched.
                                Waiting for field
                                acceptance.
                              </div>
                            )}

                          {emergency.status ===
                            'RESPONDING' &&
                            !responderArrived && (
                              <div className="resq-operation-note">
                                Responder en route.
                                Live field status is
                                synchronized with
                                ResQ Control.
                              </div>
                            )}

                          {emergency.status ===
                            'RESPONDING' &&
                            responderArrived && (
                              <div className="resq-operation-note">
                                Responder on scene.
                                Incident remains
                                active until field
                                completion.
                              </div>
                            )}
                        </article>
                      )
                    },
                  )}
                </div>
              )}
            </section>

            {/* RIGHT INTELLIGENCE COLUMN */}

            <aside className="resq-right-column">
              <section className="resq-side-panel">
                <div className="resq-side-panel-heading">
                  <div>
                    <span>
                      FIELD NETWORK
                    </span>

                    <h3>
                      Responders
                    </h3>
                  </div>

                  <ResponderIcon />
                </div>

                <div className="resq-network-summary">
                  <div>
                    <strong>
                      {availableResponders}
                    </strong>

                    <span>
                      Available
                    </span>
                  </div>

                  <div>
                    <strong>
                      {busyResponders}
                    </strong>

                    <span>
                      Engaged
                    </span>
                  </div>
                </div>

                <div className="resq-responder-list">
                  {responders
                    .slice(0, 6)
                    .map(
                      (responder) => (
                        <div
                          key={
                            responder.id
                          }
                          className="resq-responder-row"
                        >
                          <div className="resq-responder-row-main">
                            <div className="resq-mini-avatar">
                              {responder.fullName
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong>
                                {
                                  responder.fullName
                                }
                              </strong>

                              <span>
                                {responder.isBusy
                                  ? `Incident #${responder.activeEmergencyId}`
                                  : 'Ready for dispatch'}
                              </span>
                            </div>
                          </div>

                          <span
                            className={`resq-responder-state ${
                              responder.isBusy
                                ? 'busy'
                                : 'available'
                            }`}
                          >
                            {responder.isBusy
                              ? 'BUSY'
                              : 'READY'}
                          </span>
                        </div>
                      ),
                    )}
                </div>
              </section>

              <section className="resq-side-panel">
                <div className="resq-side-panel-heading">
                  <div>
                    <span>
                      RECENT ACTIVITY
                    </span>

                    <h3>
                      Closed incidents
                    </h3>
                  </div>

                  <CheckIcon />
                </div>

                {completedEmergencies.length ===
                0 ? (
                  <div className="resq-side-empty">
                    No closed incidents yet.
                  </div>
                ) : (
                  <div className="resq-closed-list">
                    {completedEmergencies
                      .slice(0, 6)
                      .map(
                        (emergency) => (
                          <div
                            key={
                              emergency.id
                            }
                            className="resq-closed-item"
                          >
                            <div>
                              <strong>
                                #
                                {
                                  emergency.id
                                }
                              </strong>

                              <span>
                                {
                                  emergencyNames[
                                    emergency
                                      .type
                                  ]
                                }
                              </span>
                            </div>

                            <span>
                              {
                                emergency.status
                              }
                            </span>
                          </div>
                        ),
                      )}
                  </div>
                )}
              </section>

              <section className="resq-system-health">
                <div className="resq-health-heading">
                  <span className="resq-online-dot" />

                  <strong>
                    ResQ systems online
                  </strong>
                </div>

                <div className="resq-health-row">
                  <span>
                    API connection
                  </span>

                  <strong className="healthy">
                    Healthy
                  </strong>
                </div>

                <div className="resq-health-row">
                  <span>
                    Incident sync
                  </span>

                  <strong>
                    5 sec
                  </strong>
                </div>

                <div className="resq-health-row">
                  <span>
                    Field units
                  </span>

                  <strong>
                    {
                      responders.length
                    }
                  </strong>
                </div>

                <div className="resq-health-row">
                  <span>
                    Location services
                  </span>

                  <strong className="healthy">
                    Active
                  </strong>
                </div>
              </section>
            </aside>
          </div>

          {/* ALERTS */}

          <section
            id="resq-alerts"
            className="resq-alerts"
          >
            <div className="resq-alerts-heading">
              <div>
                <span className="resq-section-eyebrow">
                  PUBLIC SAFETY
                </span>

                <h2>
                  Safety communications
                </h2>

                <p>
                  Publish and manage
                  operational alerts through
                  ResQ.
                </p>
              </div>
            </div>

            <SafetyAlertsPanel />
          </section>
        </main>
      </div>
    </div>
  )
}

export default OperatorDashboard