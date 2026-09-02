import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { API_URL } from '../lib/api'

import type {
  AlertSeverity,
  SafetyAlert,
} from '../types/alert'

function SafetyAlertsPanel() {
  const [alerts, setAlerts] =
    useState<SafetyAlert[]>([])

  const [title, setTitle] =
    useState('')

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

        setAlerts(
          data.alerts ?? [],
        )

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

  const handlePublish =
    async () => {
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

  return (
    <section className="alerts-panel">
      <div className="alerts-heading">
        <div>
          <p className="alerts-eyebrow">
            PUBLIC SAFETY
          </p>

          <h2>
            ResQ Alerts
          </h2>

          <p className="alerts-description">
            Publish official safety
            information for users of the
            ResQ application.
          </p>
        </div>
      </div>

      <div className="alert-form-card">
        <div className="alert-form-grid">
          <div className="alert-field">
            <label htmlFor="alert-title">
              Alert title
            </label>

            <input
              id="alert-title"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value,
                )
              }
              placeholder="Severe Weather Warning"
            />
          </div>

          <div className="alert-field">
            <label htmlFor="alert-region">
              Region
            </label>

            <input
              id="alert-region"
              value={region}
              onChange={(event) =>
                setRegion(
                  event.target.value,
                )
              }
              placeholder="Astana"
            />
          </div>

          <div className="alert-field">
            <label htmlFor="alert-severity">
              Severity
            </label>

            <select
              id="alert-severity"
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
          </div>
        </div>

        <div className="alert-field">
          <label htmlFor="alert-message">
            Public message
          </label>

          <textarea
            id="alert-message"
            value={message}
            onChange={(event) =>
              setMessage(
                event.target.value,
              )
            }
            placeholder="Enter the safety information users should receive..."
            rows={4}
            maxLength={800}
          />

          <span className="alert-counter">
            {message.length}/800
          </span>
        </div>

        {error && (
          <p className="alert-error">
            {error}
          </p>
        )}

        <button
          className="alert-publish-button"
          type="button"
          disabled={publishing}
          onClick={handlePublish}
        >
          {publishing
            ? 'Publishing...'
            : 'Publish safety alert'}
        </button>
      </div>

      <div className="alerts-list-heading">
        <h3>
          Published alerts
        </h3>

        <span>
          {alerts.length}
        </span>
      </div>

      {loading ? (
        <div className="alert-empty">
          Loading alerts...
        </div>
      ) : alerts.length === 0 ? (
        <div className="alert-empty">
          No safety alerts have been
          published.
        </div>
      ) : (
        <div className="alerts-list">
          {alerts.map((alert) => (
            <article
              key={alert.id}
              className={`operator-alert-card severity-${alert.severity.toLowerCase()}`}
            >
              <div className="operator-alert-top">
                <div>
                  <div className="operator-alert-badges">
                    <span
                      className={`severity-badge severity-badge-${alert.severity.toLowerCase()}`}
                    >
                      {alert.severity}
                    </span>

                    <span
                      className={
                        alert.isActive
                          ? 'active-badge'
                          : 'inactive-badge'
                      }
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

                <button
                  type="button"
                  className="alert-toggle-button"
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

              <p className="operator-alert-message">
                {alert.message}
              </p>

              <div className="operator-alert-footer">
                <span>
                  {alert.region}
                </span>

                <span>
                  {new Date(
                    alert.createdAt,
                  ).toLocaleString()}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default SafetyAlertsPanel