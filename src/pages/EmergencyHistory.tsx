import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { API_URL } from '../lib/api'
import { clearAuth } from '../lib/auth'

import type { Emergency } from '../types/emergency'

function EmergencyHistory() {
  const navigate = useNavigate()

  const [emergencies, setEmergencies] =
    useState<Emergency[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadEmergencies = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        clearAuth()
        navigate('/login')
        return
      }

      try {
        const response = await fetch(
          `${API_URL}/emergencies`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        const data = (await response.json()) as {
          emergencies?: Emergency[]
          message?: string
        }

        if (response.status === 401) {
          clearAuth()
          navigate('/login')
          return
        }

        if (!response.ok) {
          setError(
            data.message ||
              'Could not load emergencies',
          )
          return
        }

        setEmergencies(data.emergencies ?? [])
        setError('')
      } catch (error) {
        console.error(error)

        setError(
          'Could not connect to the server',
        )
      } finally {
        setLoading(false)
      }
    }

    loadEmergencies()
  }, [navigate])

  return (
    <div className="mobile-shell">
      <div className="page-content">
        <div className="history-page">
          <div className="mobile-header">
            <div>
              <p className="dashboard-label">
                112 EMERGENCY SERVICE
              </p>

              <h1>Emergency history</h1>
            </div>

            <button
              className="icon-circle"
              onClick={() =>
                navigate('/dashboard')
              }
              aria-label="Back to dashboard"
            >
              ←
            </button>
          </div>

          {loading && (
            <p>Loading emergencies...</p>
          )}

          {error && (
            <p className="input-error">
              {error}
            </p>
          )}

          {!loading &&
            !error &&
            emergencies.length === 0 && (
              <p className="subtitle">
                You don&apos;t have any emergency
                requests yet.
              </p>
            )}

          <div className="history-list">
            {emergencies.map((emergency) => (
              <button
                key={emergency.id}
                className="history-card"
                onClick={() =>
                  navigate(
                    `/emergency/status?id=${emergency.id}&type=${emergency.type.toLowerCase()}`,
                  )
                }
              >
                <div>
                  <strong>
                    {emergency.type}
                  </strong>

                  <small>
                    {new Date(
                      emergency.createdAt,
                    ).toLocaleString()}
                  </small>
                </div>

                <span>
                  {emergency.status}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmergencyHistory