import {
  useState,
} from 'react'
import './Login.css'
import {
  useNavigate,
} from 'react-router-dom'

import { API_URL } from '../lib/api'

import type {
  AuthResponse,
} from '../types/auth'

type IconProps = {
  size?: number
}

function MailIcon({
  size = 18,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="m5 7 7 5 7-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LockIcon({
  size = 18,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="10"
        width="16"
        height="11"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M8 10V7a4 4 0 0 1 8 0v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function EyeIcon({
  size = 18,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <circle
        cx="12"
        cy="12"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  )
}

function ShieldIcon({
  size = 18,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3 5 6v5c0 4.6 2.7 8.1 7 10 4.3-1.9 7-5.4 7-10V6l-7-3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ActivityIcon({
  size = 18,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
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

function UsersIcon({
  size = 18,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="9"
        cy="8"
        r="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M3 20c.5-4 2.5-6 6-6s5.5 2 6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M16 6.5a3 3 0 0 1 0 5.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M17 15c2.3.7 3.6 2.3 4 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Login() {
  const navigate =
    useNavigate()

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [
    showPassword,
    setShowPassword,
  ] = useState(false)

  const [
    emailError,
    setEmailError,
  ] = useState('')

  const [
    passwordError,
    setPasswordError,
  ] = useState('')

  const [
    serverError,
    setServerError,
  ] = useState('')

  const [loading, setLoading] =
    useState(false)

  const handleLogin =
    async () => {
      setEmailError('')
      setPasswordError('')
      setServerError('')

      const cleanEmail =
        email.trim()

      let hasError = false

      if (!cleanEmail) {
        setEmailError(
          'Email is required',
        )

        hasError = true
      }

      if (!password) {
        setPasswordError(
          'Password is required',
        )

        hasError = true
      }

      if (hasError) {
        return
      }

      try {
        setLoading(true)

        const response =
          await fetch(
            `${API_URL}/auth/login`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body: JSON.stringify({
                email:
                  cleanEmail,

                password,
              }),
            },
          )

        const data =
          await response.json()

        if (!response.ok) {
          setServerError(
            data.message ||
              'Sign in failed',
          )

          return
        }

        const authData =
          data as AuthResponse

        /*
          This website is only for
          OPERATOR / ADMIN accounts.
        */

        if (
          authData.user.role !==
            'OPERATOR' &&
          authData.user.role !==
            'ADMIN'
        ) {
          setServerError(
            'This portal is restricted to authorized emergency operators.',
          )

          return
        }

        localStorage.setItem(
          'token',
          authData.token,
        )

        localStorage.setItem(
          'user',
          JSON.stringify(
            authData.user,
          ),
        )

        navigate('/operator')
      } catch (error) {
        console.error(error)

        setServerError(
          'Could not connect to the control center.',
        )
      } finally {
        setLoading(false)
      }
    }

  const handleKeyDown = (
    event:
      React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <div className="operator-login-page">
      {/* LEFT PANEL */}

      <section className="operator-login-visual">
        <div className="operator-login-visual-inner">
          <div className="operator-login-brand">
            <div className="operator-login-logo">
              ResQ
            </div>

            <div>
              <strong>
                ResQ Control Center
              </strong>

              <span>
                Emergency Operations Platform
              </span>
            </div>
          </div>

          <div className="operator-login-intro">
            <p>
              EMERGENCY OPERATIONS
            </p>

            <h1>
              One command center.
              <br />
              Every active response.
            </h1>

            <span>
              Secure operational access for
              emergency dispatch,
              coordination and live responder
              management.
            </span>
          </div>

          <div className="operator-login-features">
            <div className="operator-login-feature">
              <div>
                <ActivityIcon />
              </div>

              <section>
                <strong>
                  Live incident monitoring
                </strong>

                <span>
                  Track active emergency
                  requests and operational
                  status in real time.
                </span>
              </section>
            </div>

            <div className="operator-login-feature">
              <div>
                <UsersIcon />
              </div>

              <section>
                <strong>
                  Responder coordination
                </strong>

                <span>
                  Assign available responders
                  and monitor live GPS
                  updates.
                </span>
              </section>
            </div>

            <div className="operator-login-feature">
              <div>
                <ShieldIcon />
              </div>

              <section>
                <strong>
                  Secure operations
                </strong>

                <span>
                  Restricted access for
                  authorized emergency
                  personnel only.
                </span>
              </section>
            </div>
          </div>

          <div className="operator-login-system">
            <span className="operator-login-system-dot" />

            <div>
              <strong>
                System operational
              </strong>

              <span>
                Emergency services network
                available
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* LOGIN PANEL */}

      <section className="operator-login-form-side">
        <div className="operator-login-form-wrapper">
          <div className="operator-login-mobile-brand">
            <div className="operator-login-logo">
              ResQ
            </div>

            <div>
              <strong>
                ResQ Control
              </strong>

              <span>
                Operator Portal
              </span>
            </div>
          </div>

          <div className="operator-login-form-heading">
            <p>
              SECURE OPERATOR ACCESS
            </p>

            <h2>
              Sign in to Control Center
            </h2>

            <span>
              Use your authorized operator
              credentials to continue.
            </span>
          </div>

          <div className="operator-login-form">
            <label
              className="operator-login-field"
            >
              <span>
                Email address
              </span>

              <div
                className={`operator-login-input ${
                  emailError
                    ? 'error'
                    : ''
                }`}
              >
                <MailIcon />

                <input
                  type="email"
                  value={email}
                  placeholder="operator@ResQ.kz"
                  autoComplete="email"
                  disabled={loading}
                  onChange={(event) => {
                    setEmail(
                      event.target
                        .value,
                    )

                    setEmailError('')
                    setServerError('')
                  }}
                  onKeyDown={
                    handleKeyDown
                  }
                />
              </div>

              {emailError && (
                <small className="operator-login-field-error">
                  {emailError}
                </small>
              )}
            </label>

            <label
              className="operator-login-field"
            >
              <div className="operator-login-label-row">
                <span>
                  Password
                </span>
              </div>

              <div
                className={`operator-login-input ${
                  passwordError
                    ? 'error'
                    : ''
                }`}
              >
                <LockIcon />

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={password}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                  onChange={(event) => {
                    setPassword(
                      event.target
                        .value,
                    )

                    setPasswordError(
                      '',
                    )

                    setServerError('')
                  }}
                  onKeyDown={
                    handleKeyDown
                  }
                />

                <button
                  type="button"
                  className="operator-login-eye"
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current,
                    )
                  }
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  <EyeIcon />
                </button>
              </div>

              {passwordError && (
                <small className="operator-login-field-error">
                  {passwordError}
                </small>
              )}
            </label>

            {serverError && (
              <div className="operator-login-error">
                <ShieldIcon
                  size={17}
                />

                <span>
                  {serverError}
                </span>
              </div>
            )}

            <button
              type="button"
              className="operator-login-submit"
              disabled={loading}
              onClick={handleLogin}
            >
              {loading ? (
                <>
                  <span className="operator-login-spinner" />

                  Authenticating...
                </>
              ) : (
                <>
                  Sign in to Control Center

                  <span>
                    →
                  </span>
                </>
              )}
            </button>
          </div>

          <div className="operator-login-security">
            <ShieldIcon
              size={15}
            />

            <span>
              Authorized personnel only.
              Access may be monitored and
              logged for operational security.
            </span>
          </div>
        </div>

        <footer className="operator-login-footer">
          ResQ Emergency Operations Platform
        </footer>
      </section>
    </div>
  )
}

export default Login