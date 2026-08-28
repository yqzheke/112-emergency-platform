import { useState } from 'react'
import {
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'

import Button from '../components/Button'
import Input from '../components/Input'
import Logo from '../components/Logo'

import type { EmergencyType } from '../types/emergency'

type EmergencyRequestType = Lowercase<EmergencyType>

const emergencyNames: Record<
  EmergencyRequestType,
  string
> = {
  medical: 'Medical Emergency',
  police: 'Police Emergency',
  fire: 'Fire Emergency',
}

const emergencyDescriptions: Record<
  EmergencyRequestType,
  string
> = {
  medical: 'Ambulance assistance',
  police: 'Police assistance',
  fire: 'Fire and rescue assistance',
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

function EmergencyRequest() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const type = searchParams.get('type')

  const [description, setDescription] =
    useState('')
  const [error, setError] = useState('')

  if (!isEmergencyRequestType(type)) {
    return (
      <>
        <Logo />

        <h1>Invalid emergency type</h1>

        <p className="subtitle">
          Please return to the dashboard and select
          an emergency service.
        </p>

        <Link
          className="text-button"
          to="/dashboard"
        >
          Back to dashboard
        </Link>
      </>
    )
  }

  const handleContinue = () => {
    setError('')

    const trimmedDescription =
      description.trim()

    if (!trimmedDescription) {
      setError(
        'Please briefly describe the emergency',
      )
      return
    }

    sessionStorage.setItem(
      'emergencyDescription',
      trimmedDescription,
    )

    navigate(
      `/emergency/confirm?type=${type}`,
    )
  }

  return (
    <div className="mobile-shell">
      <div className="page-content">
        <Logo />

        <p className="dashboard-label">
          {emergencyDescriptions[type]}
        </p>

        <h1>{emergencyNames[type]}</h1>

        <p className="subtitle">
          Tell us briefly what happened.
        </p>

        <Input
          label="What happened?"
          type="text"
          placeholder="Describe the emergency"
          value={description}
          onChange={setDescription}
          error={error}
        />

        <Button onClick={handleContinue}>
          Continue
        </Button>

        <p className="switch-text">
          <Link
            className="text-button"
            to="/dashboard"
          >
            Back to dashboard
          </Link>
        </p>
      </div>
    </div>
  )
}

export default EmergencyRequest