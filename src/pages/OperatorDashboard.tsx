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

/* =========================================================
   ICONS
   Inline SVG so we do not need another package.
   ========================================================= */

type IconProps = {
  size?: number
  className?: string
}

function DashboardIcon({
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
        d="M12 3L3.5 20h17L12 3Z"
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

function AlertIcon({
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
        d="M10 5H5v14h5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M13 8l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M17 12H9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ActivityIcon({
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

function scrollToSection(
  id: string,
) {
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
          'Could not connect to the server',
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

    const interval = window.setInterval(
      () => {
        loadEmergencies()
      },
      5000,
    )

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
        'Could not connect to the server',
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

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="operator-enterprise-loading">
        <div className="operator-enterprise-loading-logo">
          112
        </div>

        <strong>
          Loading Emergency Operations
        </strong>

        <span>
          Connecting to control center...
        </span>
      </div>
    )
  }

  return (
    <div className="operator-shell">
      {/* ==============================================
          SIDEBAR
          ============================================== */}

      <aside className="operator-sidebar">
        <div className="operator-sidebar-brand">
          <div className="operator-sidebar-logo">
            112
          </div>

          <div>
            <strong>112 Control</strong>
            <span>
              Emergency Operations
            </span>
          </div>
        </div>

        <div className="operator-sidebar-divider" />

        <nav className="operator-nav">
          <span className="operator-nav-label">
            OPERATIONS
          </span>

          <button
            type="button"
            className="operator-nav-item active"
            onClick={() =>
              scrollToSection(
                'operator-overview',
              )
            }
          >
            <DashboardIcon />

            <span>Overview</span>
          </button>

          <button
            type="button"
            className="operator-nav-item"
            onClick={() =>
              scrollToSection(
                'operator-incidents',
              )
            }
          >
            <EmergencyIcon />

            <span>Emergencies</span>

            {activeEmergencies.length >
              0 && (
              <span className="operator-nav-count">
                {
                  activeEmergencies.length
                }
              </span>
            )}
          </button>

          <button
            type="button"
            className="operator-nav-item"
            onClick={() =>
              scrollToSection(
                'operator-incidents',
              )
            }
          >
            <ResponderIcon />

            <span>Responders</span>

            <span className="operator-nav-count neutral">
              {availableResponders}
            </span>
          </button>

          <button
            type="button"
            className="operator-nav-item"
            onClick={() =>
              scrollToSection(
                'operator-alerts',
              )
            }
          >
            <AlertIcon />

            <span>Safety Alerts</span>
          </button>
        </nav>

        <div className="operator-sidebar-spacer" />

        <div className="operator-system-card">
          <div className="operator-system-row">
            <span className="operator-online-dot" />

            <div>
              <strong>
                System operational
              </strong>

              <span>
                Live sync every 5 seconds
              </span>
            </div>
          </div>
        </div>

        <div className="operator-sidebar-profile">
          <div className="operator-avatar">
            OP
          </div>

          <div className="operator-profile-copy">
            <strong>Operator</strong>
            <span>
              Control center
            </span>
          </div>

          <button
            type="button"
            className="operator-sidebar-logout"
            onClick={handleLogout}
            title="Sign out"
            aria-label="Sign out"
          >
            <LogoutIcon />
          </button>
        </div>
      </aside>

      {/* ==============================================
          WORKSPACE
          ============================================== */}

      <div className="operator-workspace">
        {/* TOP BAR */}

        <header className="operator-topbar">
          <div>
            <p className="operator-topbar-eyebrow">
              EMERGENCY OPERATIONS
            </p>

            <h1>
              Control Center
            </h1>
          </div>

          <div className="operator-topbar-actions">
            <div className="operator-live-pill">
              <span />

              Live
            </div>

            <button
              type="button"
              className="operator-refresh-button"
              onClick={() => {
                loadEmergencies()
                loadResponders()
              }}
            >
              <RefreshIcon />

              <span>Refresh</span>
            </button>
          </div>
        </header>

        <main className="operator-content">
          {/* ============================================
              OVERVIEW
              ============================================ */}

          <section
            id="operator-overview"
            className="operator-overview"
          >
            <div className="operator-page-heading">
              <div>
                <h2>
                  Operations overview
                </h2>

                <p>
                  Monitor active incidents,
                  responder availability and
                  emergency operations.
                </p>
              </div>

              <div className="operator-last-sync">
                <ActivityIcon size={16} />

                <span>
                  Auto-refresh enabled
                </span>
              </div>
            </div>

            <div className="operator-kpi-grid">
              <div className="operator-kpi-card">
                <div className="operator-kpi-icon blue">
                  <ActivityIcon />
                </div>

                <div className="operator-kpi-content">
                  <span>
                    Active incidents
                  </span>

                  <strong>
                    {
                      activeEmergencies.length
                    }
                  </strong>

                  <small>
                    Currently open
                  </small>
                </div>
              </div>

              <div className="operator-kpi-card">
                <div className="operator-kpi-icon amber">
                  <ClockIcon />
                </div>

                <div className="operator-kpi-content">
                  <span>
                    Awaiting action
                  </span>

                  <strong>
                    {pendingCount}
                  </strong>

                  <small>
                    Pending operator review
                  </small>
                </div>
              </div>

              <div className="operator-kpi-card">
                <div className="operator-kpi-icon green">
                  <ResponderIcon />
                </div>

                <div className="operator-kpi-content">
                  <span>
                    Available responders
                  </span>

                  <strong>
                    {availableResponders}
                  </strong>

                  <small>
                    {responders.length}{' '}
                    registered
                  </small>
                </div>
              </div>

              <div className="operator-kpi-card">
                <div className="operator-kpi-icon slate">
                  <CheckIcon />
                </div>

                <div className="operator-kpi-content">
                  <span>
                    Closed incidents
                  </span>

                  <strong>
                    {
                      completedEmergencies.length
                    }
                  </strong>

                  <small>
                    Completed or cancelled
                  </small>
                </div>
              </div>
            </div>
          </section>

          {error && (
            <div className="control-error">
              {error}
            </div>
          )}

          {/* ============================================
              OPERATIONS GRID
              ============================================ */}

          <div className="operator-operations-grid">
            {/* LIVE INCIDENTS */}

            <section
              id="operator-incidents"
              className="operator-incidents-panel"
            >
              <div className="operator-panel-header">
                <div>
                  <span className="operator-panel-eyebrow">
                    LIVE QUEUE
                  </span>

                  <h2>
                    Active emergencies
                  </h2>

                  <p>
                    Incoming and ongoing
                    emergency requests.
                  </p>
                </div>

                <div className="operator-open-count">
                  <span className="operator-open-count-dot" />

                  {
                    activeEmergencies.length
                  }{' '}
                  open
                </div>
              </div>

              {activeEmergencies.length ===
              0 ? (
                <div className="control-empty">
                  <CheckIcon size={24} />

                  <strong>
                    No active emergencies
                  </strong>

                  <span>
                    New requests will
                    automatically appear here.
                  </span>
                </div>
              ) : (
                <div className="request-list">
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
                          className="request-card"
                        >
                          {/* INCIDENT HEADER */}

                          <div className="request-card-header">
                            <div className="request-heading">
                              <div className="operator-incident-id">
                                #
                                {
                                  emergency.id
                                }
                              </div>

                              <div>
                                <div className="operator-incident-title-row">
                                  <strong className="operator-incident-name">
                                    {
                                      emergencyNames[
                                        emergency
                                          .type
                                      ]
                                    }{' '}
                                    Emergency
                                  </strong>

                                  <span
                                    className={`request-type type-${emergency.type.toLowerCase()}`}
                                  >
                                    {
                                      emergencyNames[
                                        emergency
                                          .type
                                      ]
                                    }
                                  </span>
                                </div>

                                <span className="operator-incident-time">
                                  Received{' '}
                                  {new Date(
                                    emergency.createdAt,
                                  ).toLocaleString()}
                                </span>
                              </div>
                            </div>

                            <span
                              className={`request-status status-${emergency.status.toLowerCase()}`}
                            >
                              {responderArrived
                                ? 'ON SCENE'
                                : emergency.status}
                            </span>
                          </div>

                          {/* DESCRIPTION */}

                          <div className="operator-incident-section">
                            <span className="operator-field-label">
                              INCIDENT DESCRIPTION
                            </span>

                            <p className="request-description">
                              {
                                emergency.description
                              }
                            </p>
                          </div>

                          {/* META */}

                          <div className="request-meta-grid">
                            <div>
                              <span>
                                Caller
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
                                Received
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
                                Coordinates
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

                          {/* AI ANALYSIS */}

                          {emergency.aiSummary && (
                            <div className="operator-ai-card">
                              <div className="operator-ai-header">
                                <div>
                                  <span className="operator-ai-label">
                                    AI INTAKE
                                    ANALYSIS
                                  </span>

                                  <strong>
                                    Emergency
                                    intelligence
                                  </strong>
                                </div>

                                <span className="operator-ai-badge">
                                  AI
                                </span>
                              </div>

                              <div className="operator-ai-grid">
                                <div>
                                  <span>
                                    Suggested
                                    service
                                  </span>

                                  <strong>
                                    {emergency.aiService ||
                                      'UNCLEAR'}
                                  </strong>
                                </div>

                                <div>
                                  <span>
                                    Urgency
                                  </span>

                                  <strong>
                                    {emergency.aiUrgency ||
                                      'UNCLEAR'}
                                  </strong>
                                </div>
                              </div>

                              <div className="operator-ai-summary">
                                <span>
                                  Summary
                                </span>

                                <p>
                                  {
                                    emergency.aiSummary
                                  }
                                </p>
                              </div>

                              {emergency.aiImportantDetails && (
                                <div className="operator-ai-details">
                                  <span>
                                    Important
                                    details
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

                              <p className="operator-ai-note">
                                AI-generated
                                intake assistance.
                                Operator
                                verification is
                                required.
                              </p>
                            </div>
                          )}

                          {/* MAP */}

                          <div className="operator-map-section-header">
                            <div>
                              <span className="operator-field-label">
                                LIVE INCIDENT
                                MAP
                              </span>

                              <strong>
                                Location &
                                responder
                                tracking
                              </strong>
                            </div>

                            <span className="operator-map-live-badge">
                              <span />
                              LIVE
                            </span>
                          </div>

                          <div className="operator-map-wrapper">
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

                          <div className="operator-tracking-status">
                            <div className="operator-tracking-row">
                              <span
                                className={`operator-tracking-dot ${
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
                              <span className="operator-tracking-time">
                                Last updated{' '}
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

                            <div className="operator-map-legend">
                              <div>
                                <span className="legend-marker emergency" />
                                <span>
                                  Emergency
                                </span>
                              </div>

                              <div>
                                <span className="legend-marker responder" />
                                <span>
                                  Responder
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* RESPONDER */}

                          <div className="operator-responder-section">
                            <div className="operator-responder-header">
                              <div>
                                <span>
                                  RESPONDER
                                  ASSIGNMENT
                                </span>

                                <strong>
                                  {emergency.assignedResponder
                                    ? responderArrived
                                      ? 'Responder on scene'
                                      : responderEnRoute
                                        ? 'Responder en route'
                                        : 'Responder assigned'
                                    : 'No responder assigned'}
                                </strong>
                              </div>

                              <ResponderIcon
                                size={19}
                              />
                            </div>

                            {emergency.assignedResponder ? (
                              <div className="assigned-responder-card">
                                <div className="operator-responder-identity">
                                  <div className="operator-responder-avatar">
                                    {emergency.assignedResponder.fullName
                                      .charAt(
                                        0,
                                      )
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

                                <span className="responder-assigned-badge">
                                  {responderArrived
                                    ? 'ON SCENE'
                                    : responderEnRoute
                                      ? 'EN ROUTE'
                                      : 'ASSIGNED'}
                                </span>
                              </div>
                            ) : emergency.status ===
                              'ACCEPTED' ? (
                              <div className="responder-assignment-controls">
                                <select
                                  value={
                                    selectedResponders[
                                      emergency
                                        .id
                                    ] ??
                                    ''
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
                                    Select
                                    available
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
                                    : 'Assign responder'}
                                </button>
                              </div>
                            ) : (
                              <p className="responder-empty-note">
                                Accept this
                                emergency before
                                assigning a
                                responder.
                              </p>
                            )}

                            {responders.length ===
                              0 && (
                              <p className="responder-empty-note">
                                No responder
                                accounts are
                                currently
                                available.
                              </p>
                            )}

                            <div className="operator-responder-timeline">
                              {emergency.responderAssignedAt && (
                                <p className="responder-time">
                                  <span />
                                  Assigned{' '}
                                  {new Date(
                                    emergency.responderAssignedAt,
                                  ).toLocaleString()}
                                </p>
                              )}

                              {emergency.responderAcceptedAt && (
                                <p className="responder-time">
                                  <span />
                                  Assignment
                                  accepted{' '}
                                  {new Date(
                                    emergency.responderAcceptedAt,
                                  ).toLocaleString()}
                                </p>
                              )}

                              {emergency.responderLocationUpdatedAt &&
                                !responderArrived && (
                                  <p className="responder-time">
                                    <span />
                                    GPS updated{' '}
                                    {new Date(
                                      emergency.responderLocationUpdatedAt,
                                    ).toLocaleTimeString()}
                                  </p>
                                )}

                              {emergency.responderLatitude !=
                                null &&
                                emergency.responderLongitude !=
                                  null && (
                                  <p className="responder-time">
                                    <span />
                                    GPS{' '}
                                    {emergency.responderLatitude.toFixed(
                                      5,
                                    )}
                                    ,{' '}
                                    {emergency.responderLongitude.toFixed(
                                      5,
                                    )}
                                  </p>
                                )}

                              {emergency.responderArrivedAt && (
                                <p className="responder-time">
                                  <span />
                                  Arrived{' '}
                                  {new Date(
                                    emergency.responderArrivedAt,
                                  ).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* CONTACTS */}

                          <div className="operator-contact-section">
                            <div className="operator-contact-header">
                              <div>
                                <span>
                                  EMERGENCY
                                  CONTACTS
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
                            </div>

                            {emergency
                              .notifiedContacts
                              .length ===
                            0 ? (
                              <p className="operator-no-contacts">
                                No emergency
                                contacts attached
                                to this request.
                              </p>
                            ) : (
                              <div className="operator-contact-list">
                                {emergency.notifiedContacts.map(
                                  (
                                    contact,
                                  ) => (
                                    <div
                                      key={
                                        contact.id
                                      }
                                      className="operator-contact-item"
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

                                      <span className="notification-simulation">
                                        Prepared
                                      </span>
                                    </div>
                                  ),
                                )}
                              </div>
                            )}

                            {emergency
                              .notifiedContacts
                              .length >
                              0 && (
                              <p className="notification-note">
                                Contact
                                notification
                                delivery is
                                simulated in this
                                MVP.
                              </p>
                            )}
                          </div>

                          {/* ACTION */}

                          {emergency.status ===
                            'PENDING' && (
                            <div className="request-footer">
                              <div>
                                <span className="operator-field-label">
                                  NEXT ACTION
                                </span>

                                <div className="request-next">
                                  Review and
                                  accept this
                                  incoming request.
                                </div>
                              </div>

                              <button
                                className="request-primary-action"
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
                                  : 'Accept request'}
                              </button>
                            </div>
                          )}

                          {emergency.status ===
                            'ACCEPTED' &&
                            !emergency.assignedResponder && (
                              <div className="request-footer">
                                <div className="request-next">
                                  Select and
                                  assign an
                                  available
                                  responder above.
                                </div>
                              </div>
                            )}

                          {emergency.status ===
                            'DISPATCHED' && (
                            <div className="request-footer">
                              <div className="request-next">
                                Waiting for the
                                responder to
                                accept the
                                assignment.
                              </div>
                            </div>
                          )}

                          {emergency.status ===
                            'RESPONDING' &&
                            !responderArrived && (
                              <div className="request-footer">
                                <div className="request-next">
                                  Responder is en
                                  route. Live
                                  status is
                                  controlled by
                                  the responder
                                  application.
                                </div>
                              </div>
                            )}

                          {emergency.status ===
                            'RESPONDING' &&
                            responderArrived && (
                              <div className="request-footer">
                                <div className="request-next">
                                  Responder is on
                                  scene. Waiting
                                  for incident
                                  completion.
                                </div>
                              </div>
                            )}
                        </article>
                      )
                    },
                  )}
                </div>
              )}
            </section>

            {/* RIGHT COLUMN */}

            <aside className="operator-right-column">
              <div className="control-side-card">
                <div className="operator-side-card-header">
                  <div>
                    <p className="control-side-label">
                      RECENT ACTIVITY
                    </p>

                    <h3>
                      Closed incidents
                    </h3>
                  </div>

                  <CheckIcon
                    size={18}
                  />
                </div>

                {completedEmergencies.length ===
                0 ? (
                  <div className="control-side-empty">
                    No closed incidents yet.
                  </div>
                ) : (
                  <div className="closed-list">
                    {completedEmergencies
                      .slice(0, 7)
                      .map(
                        (emergency) => (
                          <div
                            key={
                              emergency.id
                            }
                            className="closed-item"
                          >
                            <div className="closed-item-left">
                              <div className="closed-incident-icon">
                                <CheckIcon
                                  size={13}
                                />
                              </div>

                              <div>
                                <strong>
                                  Incident #
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
              </div>

              <div className="operator-status-card">
                <div className="operator-status-card-header">
                  <span className="operator-online-dot" />

                  <strong>
                    Operations status
                  </strong>
                </div>

                <div className="operator-status-metric">
                  <span>
                    API connection
                  </span>

                  <strong className="healthy">
                    Healthy
                  </strong>
                </div>

                <div className="operator-status-metric">
                  <span>
                    Incident sync
                  </span>

                  <strong>
                    5 seconds
                  </strong>
                </div>

                <div className="operator-status-metric">
                  <span>
                    Responder network
                  </span>

                  <strong>
                    {responders.length}{' '}
                    units
                  </strong>
                </div>
              </div>
            </aside>
          </div>

          {/* ============================================
              SAFETY ALERTS
              ============================================ */}

          <section
            id="operator-alerts"
            className="operator-alerts-section"
          >
            <SafetyAlertsPanel />
          </section>
        </main>
      </div>
    </div>
  )
}

export default OperatorDashboard