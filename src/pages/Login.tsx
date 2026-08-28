import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Button from '../components/Button'
import Input from '../components/Input'
import Logo from '../components/Logo'

import { API_URL } from '../lib/api'
import { getHomeRoute } from '../lib/auth'

import type { AuthResponse } from '../types/auth'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setEmailError('')
    setPasswordError('')
    setServerError('')

    let hasError = false

    if (!email.trim()) {
      setEmailError('Email is required')
      hasError = true
    }

    if (!password) {
      setPasswordError('Password is required')
      hasError = true
    }

    if (hasError) {
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setServerError(data.message || 'Login failed')
        return
      }

      const authData = data as AuthResponse

      localStorage.setItem('token', authData.token)
      localStorage.setItem(
        'user',
        JSON.stringify(authData.user),
      )

      navigate(getHomeRoute(authData.user))
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
          Emergency response platform
        </p>

        <h1>Welcome back</h1>

        <p className="subtitle">
          Sign in to access your 112 emergency dashboard.
        </p>
      </div>

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
        placeholder="Enter your password"
        value={password}
        onChange={setPassword}
        error={passwordError}
      />

      <Link
        className="forgot-button"
        to="/forgot-password"
      >
        Forgot password?
      </Link>

      {serverError && (
        <p className="input-error">
          {serverError}
        </p>
      )}

      <Button
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Login'}
      </Button>

      <p className="switch-text">
        Don&apos;t have an account?{' '}
        <Link
          className="text-button"
          to="/register"
        >
          Register now
        </Link>
      </p>
    </div>
  )
}

export default Login