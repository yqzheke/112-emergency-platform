import { useState } from 'react'
import { Link } from 'react-router-dom'

import Button from '../components/Button'
import Input from '../components/Input'
import Logo from '../components/Logo'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  const handleSubmit = () => {
    setEmailError('')

    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      setEmailError('Email is required')
      return
    }

    if (!trimmedEmail.includes('@')) {
      setEmailError('Please enter a valid email')
      return
    }

    // Password reset will be implemented later.
  }

  return (
    <div className="auth-card">
      <Logo />

      <h1>Forgot password?</h1>

      <p className="subtitle">
        Enter your email and we&apos;ll help you
        reset your password.
      </p>

      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={setEmail}
        error={emailError}
      />

      <Button onClick={handleSubmit}>
        Send reset link
      </Button>

      <p className="switch-text">
        Remember your password?{' '}

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

export default ForgotPassword