import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { API_URL } from '../lib/api'

import './SafetyAlertsPanel.css'

import type {
  AlertSeverity,
  SafetyAlert,
} from '../types/alert'

function AlertIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
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

function BroadcastIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="2"
        fill="currentColor"
      />

      <path
        d="M8.2 8.2a5.4 5.4 0 0 0 0 7.6M15.8 8.2a5.4 5.4 0 0 1 0 7.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M5.3 5.3a9.5 9.5 0 0 0 0 13.4M18.7 5.3a9.5 9.5 0 0 1 0 13.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SafetyAlertsPanel() {
  const [alerts, setAlerts] =
    useState<SafetyAlert[]>([])

  const [title, setTitle] = useState('')
  const [message, setMessage] =
    useState('')
  const [region, setRegion] =
    useState('')

  const [severity, setSeverity] =
    useState<AlertSeverity>('INFO')

  const [loading, setLoading] =
    useState(true)

  const [publishing, setPublishing] =
    useState(false)

  const [updatingId, setUpdatingId] =
    useState<number | null>(null)

  const [error, setError] =
    useState('')

  const getToken = () =>
    localStorage.getItem('token')

  const loadAlerts =
    useCallback(async () => {
      const token = getToken()

      if (!token) {
        setError(
          'Authentication required',
        )

        setLoading(false)

        return
      }

      try {
        const response = await fetch(
          `${API_URL}/alerts/manage`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        )

        const data =
          (await response.json()) as {
            alerts?: SafetyAlert[]
            message?: string
          }

        if (!response.ok) {
          throw new Error(
            data.message ||
              'Could not load alerts',
          )
        }

        setAlerts(data.alerts ?? [])
        setError('')
      } catch (error) {
        console.error(error)

        setError(
          error instanceof Error
            ? error.message
            : 'Could not load alerts',
        )
      } finally {
        setLoading(false)
      }
    }, [])

  useEffect(() => {
    loadAlerts()
  }, [loadAlerts])

  const handlePublish = async () => {
    const cleanTitle =
      title.trim()

    const cleanMessage =
      message.trim()

    const cleanRegion =
      region.trim()

    setError('')

    if (
      !cleanTitle ||
      !cleanMessage ||
      !cleanRegion
    ) {
      setError(
        'Title, message and region are required.',
      )

      return
    }

    const token = getToken()

    if (!token) {
      setError(
        'Authentication required',
      )

      return
    }

    try {
      setPublishing(true)

      const response = await fetch(
        `${API_URL}/alerts`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            title: cleanTitle,
            message: cleanMessage,
            region: cleanRegion,
            severity,
          }),
        },
      )

      const data =
        (await response.json()) as {
          alert?: SafetyAlert
          message?: string
        }

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Could not publish alert',
        )
      }

      setTitle('')
      setMessage('')
      setRegion('')
      setSeverity('INFO')

      await loadAlerts()
    } catch (error) {
      console.error(error)

      setError(
        error instanceof Error
          ? error.message
          : 'Could not publish alert',
      )
    } finally {
      setPublishing(false)
    }
  }

  const handleToggle = async (
    alert: SafetyAlert,
  ) => {
    const token = getToken()

    if (!token) {
      setError(
        'Authentication required',
      )

      return
    }

    try {
      setUpdatingId(alert.id)
      setError('')

      const response = await fetch(
        `${API_URL}/alerts/${alert.id}`,
        {
          method: 'PATCH',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            isActive:
              !alert.isActive,
          }),
        },
      )

      const data =
        (await response.json()) as {
          alert?: SafetyAlert
          message?: string
        }

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Could not update alert',
        )
      }

      await loadAlerts()
    } catch (error) {
      console.error(error)

      setError(
        error instanceof Error
          ? error.message
          : 'Could not update alert',
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const activeAlerts =
    alerts.filter(
      (alert) => alert.isActive,
    ).length

  return (
    <section className="resq-safety-panel">
      <div className="resq-safety-header">
        <div>
          <span className="resq-safety-eyebrow">
            RESQ SAFETY NETWORK
          </span>

          <h2>
            Public Safety Alerts
          </h2>

          <p>
            Publish verified safety
            information directly to ResQ
            users.
          </p>
        </div>

        <div className="resq-safety-summary">
          <div className="resq-safety-summary-icon">
            <BroadcastIcon />
          </div>

          <div>
            <strong>
              {activeAlerts}
            </strong>

            <span>
              Active notices
            </span>
          </div>
        </div>
      </div>

      <div className="resq-alert-compose">
        <div className="resq-alert-compose-header">
          <div>
            <span>
              CREATE ALERT
            </span>

            <h3>
              Broadcast safety information
            </h3>
          </div>

          <div className="resq-alert-compose-icon">
            <AlertIcon />
          </div>
        </div>

        <div className="resq-alert-form-grid">
          <label className="resq-alert-field resq-alert-title-field">
            <span>
              Alert title
            </span>

            <input
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value,
                )
              }
              placeholder="Severe Weather Warning"
            />
          </label>

          <label className="resq-alert-field">
            <span>
              Region
            </span>

            <input
              value={region}
              onChange={(event) =>
                setRegion(
                  event.target.value,
                )
              }
              placeholder="Astana"
            />
          </label>

          <label className="resq-alert-field">
            <span>
              Severity
            </span>

            <select
              value={severity}
              onChange={(event) =>
                setSeverity(
                  event.target
                    .value as AlertSeverity,
                )
              }
            >
              <option value="INFO">
                Information
              </option>

              <option value="WARNING">
                Warning
              </option>

              <option value="CRITICAL">
                Critical
              </option>
            </select>
          </label>
        </div>

        <label className="resq-alert-field">
          <span>
            Public message
          </span>

          <textarea
            value={message}
            onChange={(event) =>
              setMessage(
                event.target.value,
              )
            }
            placeholder="Enter verified public safety information..."
            rows={5}
            maxLength={800}
          />

          <small>
            {message.length}/800
          </small>
        </label>

        {error && (
          <div className="resq-alert-error">
            <AlertIcon />

            <span>
              {error}
            </span>
          </div>
        )}

        <div className="resq-alert-compose-footer">
          <div>
            <span className="resq-alert-secure-dot" />

            Published alerts become
            visible to ResQ users.
          </div>

          <button
            type="button"
            disabled={publishing}
            onClick={handlePublish}
          >
            <BroadcastIcon />

            {publishing
              ? 'Publishing...'
              : 'Publish alert'}
          </button>
        </div>
      </div>

      <div className="resq-alert-list-heading">
        <div>
          <span>
            ALERT HISTORY
          </span>

          <h3>
            Published alerts
          </h3>
        </div>

        <div className="resq-alert-count">
          {alerts.length}
        </div>
      </div>

      {loading ? (
        <div className="resq-alert-empty">
          Loading safety alerts...
        </div>
      ) : alerts.length === 0 ? (
        <div className="resq-alert-empty">
          <div>
            <BroadcastIcon />
          </div>

          <strong>
            No alerts published
          </strong>

          <span>
            Safety broadcasts will appear
            here.
          </span>
        </div>
      ) : (
        <div className="resq-alert-list">
          {alerts.map((alert) => (
            <article
              key={alert.id}
              className={`resq-alert-card severity-${alert.severity.toLowerCase()}`}
            >
              <div className="resq-alert-card-top">
                <div className="resq-alert-card-main">
                  <div
                    className={`resq-alert-severity-icon severity-${alert.severity.toLowerCase()}`}
                  >
                    <AlertIcon />
                  </div>

                  <div>
                    <div className="resq-alert-badges">
                      <span
                        className={`resq-alert-severity severity-${alert.severity.toLowerCase()}`}
                      >
                        {
                          alert.severity
                        }
                      </span>

                      <span
                        className={`resq-alert-state ${
                          alert.isActive
                            ? 'active'
                            : 'inactive'
                        }`}
                      >
                        {alert.isActive
                          ? 'ACTIVE'
                          : 'INACTIVE'}
                      </span>
                    </div>

                    <h4>
                      {alert.title}
                    </h4>
                  </div>
                </div>

                <button
                  type="button"
                  className="resq-alert-toggle"
                  disabled={
                    updatingId ===
                    alert.id
                  }
                  onClick={() =>
                    handleToggle(alert)
                  }
                >
                  {updatingId ===
                  alert.id
                    ? 'Updating...'
                    : alert.isActive
                      ? 'Deactivate'
                      : 'Activate'}
                </button>
              </div>

              <p className="resq-alert-message">
                {alert.message}
              </p>

              <div className="resq-alert-meta">
                <div>
                  <span>
                    REGION
                  </span>

                  <strong>
                    {alert.region}
                  </strong>
                </div>

                <div>
                  <span>
                    PUBLISHED
                  </span>

                  <strong>
                    {new Date(
                      alert.createdAt,
                    ).toLocaleString()}
                  </strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default SafetyAlertsPanel