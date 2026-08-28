import { useEffect, useState } from 'react'
import {
  useNavigate,
  useSearchParams,
} from 'react-router-dom'

import Button from '../components/Button'
import Logo from '../components/Logo'

import { API_URL } from '../lib/api'
import { clearAuth } from '../lib/auth'

import type { Contact } from '../types/contact'
import type { EmergencyType } from '../types/emergency'

type EmergencyRequestType = Lowercase<EmergencyType>

interface Location {
  latitude: number
  longitude: number
}

const emergencyNames: Record<
  EmergencyRequestType,
  string
> = {
  medical: 'Medical Emergency',
  police: 'Police Emergency',
  fire: 'Fire Emergency',
}

function isEmergencyRequestType(
  value: string | null,
): value is EmergencyRequestType {
  return (
    value === 'medical' ||
    value === 'police' ||
    value === 'fire'
  )
}

function EmergencyConfirm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const rawType = searchParams.get('type')

  const type = isEmergencyRequestType(rawType)
    ? rawType
    : null

  const [contacts, setContacts] =
    useState<Contact[]>([])

  const [location, setLocation] =
    useState<Location | null>(null)

  const [loadingContacts, setLoadingContacts] =
    useState(true)

  const [loadingLocation, setLoadingLocation] =
    useState(true)

  const [locationError, setLocationError] =
    useState('')

  const [sending, setSending] =
    useState(false)

  useEffect(() => {
    const loadContacts = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        clearAuth()
        navigate('/login')
        return
      }

      try {
        const response = await fetch(
          `${API_URL}/contacts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        const data = (await response.json()) as {
          contacts?: Contact[]
          message?: string
        }

        if (response.status === 401) {
          clearAuth()
          navigate('/login')
          return
        }

        if (!response.ok) {
          console.error(
            data.message ||
              'Could not load emergency contacts',
          )
          return
        }

        setContacts(data.contacts ?? [])
      } catch (error) {
        console.error(
          'Could not load emergency contacts:',
          error,
        )
      } finally {
        setLoadingContacts(false)
      }
    }

    loadContacts()
  }, [navigate])

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError(
        'Location services are not supported by this browser.',
      )
      setLoadingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })

        setLocationError('')
        setLoadingLocation(false)
      },
      () => {
        setLocationError(
          'We could not access your location. Please allow location access.',
        )

        setLoadingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  }, [])

  const handleConfirm = async () => {
    setLocationError('')

    if (!type) {
      navigate('/dashboard')
      return
    }

    if (!location) {
      setLocationError(
        'Your location is required to send an emergency request.',
      )
      return
    }

    const description = sessionStorage.getItem(
      'emergencyDescription',
    )

    if (!description) {
      navigate(`/emergency?type=${type}`)
      return
    }

    const token = localStorage.getItem('token')

    if (!token) {
      clearAuth()
      navigate('/login')
      return
    }

    try {
      setSending(true)

      const response = await fetch(
        `${API_URL}/emergencies`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            type: type.toUpperCase(),
            description,
            latitude: location.latitude,
            longitude: location.longitude,
          }),
        },
      )

      const data = (await response.json()) as {
        message?: string
        emergency?: {
          id: number
        }
      }

      if (response.status === 401) {
        clearAuth()
        navigate('/login')
        return
      }

      if (!response.ok) {
        setLocationError(
          data.message ||
            'Could not send emergency request',
        )
        return
      }

      if (!data.emergency) {
        setLocationError(
          'The server returned an invalid emergency response.',
        )
        return
      }

      sessionStorage.removeItem(
        'emergencyDescription',
      )

      navigate(
        `/emergency/status?id=${data.emergency.id}&type=${type}`,
      )
    } catch (error) {
      console.error(error)

      setLocationError(
        'Could not connect to the emergency server',
      )
    } finally {
      setSending(false)
    }
  }

  if (!type) {
    return (
      <div className="mobile-shell">
        <div className="page-content">
          <Logo />

          <h1>Invalid emergency type</h1>

          <p className="subtitle">
            Please return to the dashboard and select
            an emergency service.
          </p>

          <Button
            onClick={() => navigate('/dashboard')}
          >
            Back to dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mobile-shell">
      <div className="page-content">
        <Logo />

        <h1>Confirm emergency</h1>

        <p className="subtitle">
          Please review the information before
          sending the request.
        </p>

        <div className="confirmation-card">
          <p>
            <strong>Service</strong>
            <br />
            {emergencyNames[type]}
          </p>

          <p>
            <strong>Location</strong>
            <br />

            {loadingLocation &&
              'Detecting your location...'}

            {!loadingLocation && location && (
              <>
                Location detected
                <br />

                <small>
                  {location.latitude.toFixed(6)},{' '}
                  {location.longitude.toFixed(6)}
                </small>
              </>
            )}

            {!loadingLocation && !location && (
              <>
                Location unavailable
                <br />

                <small>{locationError}</small>
              </>
            )}
          </p>
        </div>

        {locationError && (
          <p className="input-error">
            {locationError}
          </p>
        )}

        <div className="emergency-contacts-preview">
          <p className="dashboard-label">
            EMERGENCY CONTACTS
          </p>

          <h2>Contacts for this emergency</h2>

          {loadingContacts && (
            <p className="subtitle">
              Loading contacts...
            </p>
          )}

          {!loadingContacts &&
            contacts.length === 0 && (
              <p className="subtitle">
                No emergency contacts saved.
              </p>
            )}

          {!loadingContacts &&
            contacts.map((contact) => (
              <div
                key={contact.id}
                className="emergency-contact-preview-item"
              >
                <div>
                  <strong>{contact.name}</strong>
                  <span>{contact.phone}</span>
                </div>

                <span className="contact-ready">
                  Ready
                </span>
              </div>
            ))}
        </div>

        <Button
          onClick={handleConfirm}
          disabled={sending}
        >
          {sending
            ? 'Sending request...'
            : 'Send emergency request'}
        </Button>

        <p className="switch-text">
          <button
            className="text-button"
            onClick={() =>
              navigate(`/emergency?type=${type}`)
            }
          >
            Go back
          </button>
        </p>
      </div>
    </div>
  )
}

export default EmergencyConfirm