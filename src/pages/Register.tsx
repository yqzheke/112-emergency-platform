import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Button from '../components/Button'
import Input from '../components/Input'
import Logo from '../components/Logo'

import { API_URL } from '../lib/api'

function Register() {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [fullNameError, setFullNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    setFullNameError('')
    setEmailError('')
    setPasswordError('')
    setServerError('')

    let hasError = false

    if (!fullName.trim()) {
      setFullNameError('Full name is required')
      hasError = true
    }

    if (!email.trim()) {
      setEmailError('Email is required')
      hasError = true
    } else if (!email.includes('@')) {
      setEmailError('Please enter a valid email')
      hasError = true
    }

    if (!password) {
      setPasswordError('Password is required')
      hasError = true
    } else if (password.length < 8) {
      setPasswordError(
        'Password must contain at least 8 characters',
      )
      hasError = true
    }

    if (hasError) {
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName,
            email,
            password,
          }),
        },
      )

      const data = (await response.json()) as {
        message?: string
      }

      if (!response.ok) {
        setServerError(
          data.message || 'Registration failed',
        )
        return
      }

      navigate('/login')
    } catch (error) {
      console.error(error)
      setServerError('Could not connect to the server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <div className="top-bar-space" />

      <Logo />

      <div className="auth-header">
        <p className="auth-eyebrow">
          Create your account
        </p>

        <h1>Join 112</h1>

        <p className="subtitle">
          Register to request emergency assistance and
          track response updates.
        </p>
      </div>

      <Input
        label="Full name"
        type="text"
        placeholder="Enter your full name"
        value={fullName}
        onChange={setFullName}
        error={fullNameError}
      />

      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={setEmail}
        error={emailError}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Create a password"
        value={password}
        onChange={setPassword}
        error={passwordError}
      />

      {serverError && (
        <p className="input-error">
          {serverError}
        </p>
      )}

      <Button
        onClick={handleRegister}
        disabled={loading}
      >
        {loading ? 'Creating account...' : 'Register'}
      </Button>

      <p className="switch-text">
        Already have an account?{' '}
        <Link
          className="text-button"
          to="/login"
        >
          Login
        </Link>
      </p>
    </div>
  )
}

export default Register