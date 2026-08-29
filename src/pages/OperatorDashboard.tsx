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
  FIRE: 'Fire',
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

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="control-center">
        <div className="operator-loading">
          Loading control center...
        </div>
      </div>
    )
  }

  return (
    <div className="control-center">
      <header className="control-header">
        <div className="control-brand">
          <div className="control-logo">
            112
          </div>

          <div>
            <p>OPERATOR SYSTEM</p>

            <h1>
              Emergency Control Center
            </h1>
          </div>
        </div>

        <div className="control-header-actions">
          <button
            className="control-refresh"
            onClick={() => {
              loadEmergencies()
              loadResponders()
            }}
          >
            Refresh
          </button>

          <button
            className="control-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <section className="control-stats">
        <div className="control-stat">
          <span>
            Active requests
          </span>

          <strong>
            {
              activeEmergencies.length
            }
          </strong>
        </div>

        <div className="control-stat warning">
          <span>
            Waiting for action
          </span>

          <strong>
            {pendingCount}
          </strong>
        </div>

        <div className="control-stat">
          <span>
            Responders
          </span>

          <strong>
            {responders.length}
          </strong>
        </div>

        <div className="control-stat">
          <span>
            Completed
          </span>

          <strong>
            {
              completedEmergencies.length
            }
          </strong>
        </div>
      </section>

      {error && (
        <div className="control-error">
          {error}
        </div>
      )}

      <main className="control-layout">
        <section className="control-main">
          <div className="control-section-title">
            <div>
              <p>LIVE QUEUE</p>

              <h2>
                Active emergencies
              </h2>
            </div>

            <span>
              {
                activeEmergencies.length
              }{' '}
              open
            </span>
          </div>

          {activeEmergencies.length ===
          0 ? (
            <div className="control-empty">
              <strong>
                No active emergencies
              </strong>

              <span>
                New requests will appear
                here.
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
                      <div className="request-card-header">
                        <div className="request-heading">
                          <span className="request-number">
                            #{emergency.id}
                          </span>

                          <div
                            className={`request-type type-${emergency.type.toLowerCase()}`}
                          >
                            {
                              emergencyNames[
                                emergency.type
                              ]
                            }
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

                      <p className="request-description">
                        {
                          emergency.description
                        }
                      </p>

                      {emergency.aiSummary && (
                        <div className="operator-ai-card">
                          <div className="operator-ai-header">
                            <div>
                              <span className="operator-ai-label">
                                AI EMERGENCY
                                ASSIST
                              </span>

                              <strong>
                                Operator
                                analysis
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
                            AI-generated intake
                            assistance. Operator
                            verification is
                            required.
                          </p>
                        </div>
                      )}

                      <div className="request-meta-grid">
                        <div>
                          <span>User</span>

                          <strong>
                            {
                              emergency.user
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
                            Location
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

                      <div className="operator-map-wrapper">
                        <EmergencyMap
                          latitude={
                            emergency.latitude
                          }
                          longitude={
                            emergency.longitude
                          }
                        />
                      </div>

                      <div className="operator-responder-section">
                        <div className="operator-responder-header">
                          <div>
                            <span>
                              RESPONDER
                            </span>

                            <strong>
                              {emergency.assignedResponder
                                ? responderArrived
                                  ? 'Responder on scene'
                                  : responderEnRoute
                                    ? 'Responder en route'
                                    : 'Assigned'
                                : 'Not assigned'}
                            </strong>
                          </div>
                        </div>

                        {emergency.assignedResponder ? (
                          <div className="assigned-responder-card">
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
                                  emergency.id
                                ] ?? ''
                              }
                              onChange={(
                                event,
                              ) => {
                                const value =
                                  Number(
                                    event.target
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
                                Select responder
                              </option>

                              {responders.map(
  (responder) => (
    <option
      key={responder.id}
      value={responder.id}
      disabled={responder.isBusy}
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
                                  emergency.id
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
                            Accept this request
                            before assigning a
                            responder.
                          </p>
                        )}

                        {responders.length ===
                          0 && (
                          <p className="responder-empty-note">
                            No RESPONDER
                            accounts are
                            available.
                          </p>
                        )}

                        {emergency.responderAssignedAt && (
                          <p className="responder-time">
                            Assigned{' '}
                            {new Date(
                              emergency.responderAssignedAt,
                            ).toLocaleString()}
                          </p>
                        )}

                        {emergency.responderAcceptedAt && (
                          <p className="responder-time">
                            Assignment accepted{' '}
                            {new Date(
                              emergency.responderAcceptedAt,
                            ).toLocaleString()}
                          </p>
                        )}

                        {emergency.responderLocationUpdatedAt &&
                          !responderArrived && (
                            <p className="responder-time">
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
                              Responder GPS:{' '}
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
                            Arrived{' '}
                            {new Date(
                              emergency.responderArrivedAt,
                            ).toLocaleString()}
                          </p>
                        )}
                      </div>

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
                            contacts attached.
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
                            Contact notification
                            delivery is simulated
                            in this MVP.
                          </p>
                        )}
                      </div>

                      {emergency.status ===
                        'PENDING' && (
                        <div className="request-footer">
                          <div className="request-next">
                            Operator action
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
                              Select and assign a
                              responder above
                            </div>
                          </div>
                        )}

                      {emergency.status ===
                        'DISPATCHED' && (
                          <div className="request-footer">
                            <div className="request-next">
                              Waiting for
                              responder to accept
                              assignment
                            </div>
                          </div>
                        )}

                      {emergency.status ===
                        'RESPONDING' &&
                        !responderArrived && (
                          <div className="request-footer">
                            <div className="request-next">
                              Responder is en
                              route. Status is
                              controlled from the
                              responder app.
                            </div>
                          </div>
                        )}

                      {emergency.status ===
                        'RESPONDING' &&
                        responderArrived && (
                          <div className="request-footer">
                            <div className="request-next">
                              Responder is on
                              scene. Waiting for
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

        <aside className="control-side">
          <div className="control-side-card">
            <p className="control-side-label">
              CLOSED REQUESTS
            </p>

            <h3>
              Recent activity
            </h3>

            {completedEmergencies.length ===
            0 ? (
              <div className="control-side-empty">
                No completed emergencies yet.
              </div>
            ) : (
              <div className="closed-list">
                {completedEmergencies
                  .slice(0, 6)
                  .map(
                    (emergency) => (
                      <div
                        key={
                          emergency.id
                        }
                        className="closed-item"
                      >
                        <div>
                          <strong>
                            #{emergency.id}
                          </strong>

                          <span>
                            {
                              emergencyNames[
                                emergency.type
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
          </div>
        </aside>
      </main>

      <SafetyAlertsPanel />
    </div>
  )
}

export default OperatorDashboard