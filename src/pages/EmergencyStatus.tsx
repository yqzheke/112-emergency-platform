import { useEffect, useState } from 'react'
import {
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'

import EmergencyMap from '../components/EmergencyMap'
import Logo from '../components/Logo'

import { API_URL } from '../lib/api'
import { clearAuth } from '../lib/auth'

import type {
  EmergencyType,
  EmergencyWithContacts,
} from '../types/emergency'

const emergencyNames: Record<
  EmergencyType,
  string
> = {
  MEDICAL: 'Medical Emergency',
  POLICE: 'Police Emergency',
  FIRE: 'Fire Emergency',
}

function EmergencyStatus() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const emergencyId = searchParams.get('id')

  const [emergency, setEmergency] =
    useState<EmergencyWithContacts | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!emergencyId) {
      setError('Emergency ID is missing')
      setLoading(false)
      return
    }

    let isMounted = true

    const loadEmergency = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        clearAuth()
        navigate('/login')
        return
      }

      try {
        const response = await fetch(
          `${API_URL}/emergencies/${emergencyId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        const data = (await response.json()) as {
          emergency?: EmergencyWithContacts
          message?: string
        }

        if (response.status === 401) {
          clearAuth()
          navigate('/login')
          return
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              'Could not load emergency',
          )
        }

        if (!data.emergency) {
          throw new Error(
            'Emergency request not found',
          )
        }

        if (isMounted) {
          setEmergency(data.emergency)
          setError('')
        }
      } catch (error) {
        console.error(
          'Could not load emergency:',
          error,
        )

        if (isMounted) {
          setError('Could not load emergency')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    // Load immediately.
    loadEmergency()

    // Then refresh automatically every 3 seconds.
    const intervalId = window.setInterval(
      loadEmergency,
      3000,
    )

    return () => {
      isMounted = false
      window.clearInterval(intervalId)
    }
  }, [emergencyId, navigate])

  if (loading) {
    return (
      <div className="mobile-shell">
        <div className="page-content">
          <Logo />

          <p className="subtitle">
            Loading emergency request...
          </p>
        </div>
      </div>
    )
  }

  if (error || !emergency) {
    return (
      <div className="mobile-shell">
        <div className="page-content">
          <Logo />

          <h1>Emergency request</h1>

          <p className="input-error">
            {error ||
              'Emergency request not found'}
          </p>

          <p className="switch-text">
            <Link
              className="text-button"
              to="/dashboard"
            >
              Return to dashboard
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mobile-shell">
      <div className="page-content">
        <Logo />

        <p className="dashboard-label">
          REQUEST #{emergency.id}
        </p>

        <h1>
          {emergencyNames[emergency.type]}
        </h1>

        <p className="subtitle">
          Status updates automatically.
        </p>

        <div className="confirmation-card">
          <p>
            <strong>Status</strong>
            <br />
            {emergency.status}
          </p>

          <p>
            <strong>Description</strong>
            <br />
            {emergency.description}
          </p>

          <p>
            <strong>Location</strong>
            <br />
            {emergency.latitude.toFixed(6)},{' '}
            {emergency.longitude.toFixed(6)}
          </p>

          <p>
            <strong>Created</strong>
            <br />
            {new Date(
              emergency.createdAt,
            ).toLocaleString()}
          </p>
        </div>

        <div className="status-card">
          <div className="status-item completed">
            <span>✓</span>

            <div>
              <strong>Request sent</strong>

              <small>
                Your emergency request was submitted.
              </small>
            </div>
          </div>

          <div
            className={
              [
                'ACCEPTED',
                'DISPATCHED',
                'RESPONDING',
                'COMPLETED',
              ].includes(emergency.status)
                ? 'status-item completed'
                : 'status-item'
            }
          >
            <span>2</span>

            <div>
              <strong>Request accepted</strong>

              <small>
                Emergency services accepted your
                request.
              </small>
            </div>
          </div>

          <div
            className={
              [
                'DISPATCHED',
                'RESPONDING',
                'COMPLETED',
              ].includes(emergency.status)
                ? 'status-item completed'
                : 'status-item'
            }
          >
            <span>3</span>

            <div>
              <strong>
                Responder dispatched
              </strong>

              <small>
                A responder has been assigned.
              </small>
            </div>
          </div>

          <div
            className={
              [
                'RESPONDING',
                'COMPLETED',
              ].includes(emergency.status)
                ? 'status-item completed'
                : 'status-item'
            }
          >
            <span>4</span>

            <div>
              <strong>
                Responder on the way
              </strong>

              <small>
                Emergency services are responding.
              </small>
            </div>
          </div>

          <div
            className={
              emergency.status === 'COMPLETED'
                ? 'status-item completed'
                : 'status-item'
            }
          >
            <span>5</span>

            <div>
              <strong>Completed</strong>

              <small>
                Emergency response completed.
              </small>
            </div>
          </div>
        </div>

        <div className="map-section">
          <div className="map-section-header">
            <div>
              <p className="dashboard-label">
                LIVE LOCATION
              </p>

              <h2>
                Your emergency location
              </h2>
            </div>
          </div>

          <EmergencyMap
            latitude={emergency.latitude}
            longitude={emergency.longitude}
          />

          <p className="map-coordinates">
            {emergency.latitude.toFixed(6)},{' '}
            {emergency.longitude.toFixed(6)}
          </p>
        </div>

        <div className="emergency-status-contacts">
          <p className="dashboard-label">
            EMERGENCY CONTACTS
          </p>

          <h2>
            Contacts attached to this request
          </h2>

          {emergency.notifiedContacts.length ===
          0 ? (
            <p className="subtitle">
              No emergency contacts were attached.
            </p>
          ) : (
            <div className="status-contact-list">
              {emergency.notifiedContacts.map(
                (contact) => (
                  <div
                    key={contact.id}
                    className="status-contact"
                  >
                    <div className="contact-avatar">
                      {contact.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <strong>
                        {contact.name}
                      </strong>

                      <span>
                        {contact.phone}
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </div>

        <p className="switch-text">
          <Link
            className="text-button"
            to="/history"
          >
            Emergency history
          </Link>

          {' · '}

          <Link
            className="text-button"
            to="/dashboard"
          >
            Dashboard
          </Link>
        </p>
      </div>
    </div>
  )
}

export default EmergencyStatus