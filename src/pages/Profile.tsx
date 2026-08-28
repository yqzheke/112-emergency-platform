import { useNavigate } from 'react-router-dom'

import {
  clearAuth,
  getStoredUser,
} from '../lib/auth'

function Profile() {
  const navigate = useNavigate()

  const user = getStoredUser()

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  return (
    <div className="mobile-shell">
      <div className="top-bar-space" />

      <div className="page-content">
        <div className="mobile-header">
          <div>
            <p
              className="section-title"
              style={{ marginTop: 0 }}
            >
              Profile
            </p>

            <h1>Settings</h1>
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

        <div className="profile-block">
          <p>
            <strong>Name</strong>
            <br />
            {user?.fullName || 'Unknown user'}
          </p>

          <p>
            <strong>Email</strong>
            <br />
            {user?.email || 'No email'}
          </p>

          <p>
            <strong>Role</strong>
            <br />
            {user?.role || 'USER'}
          </p>
        </div>

        <p className="section-title">
          Preferences
        </p>

        <button className="secondary-tile">
          <strong>
            Automatic GPS Sharing
          </strong>

          <small>
            Enabled for emergency requests
          </small>
        </button>

        <button
          className="secondary-tile"
          onClick={() => navigate('/contacts')}
        >
          <strong>
            Emergency Contacts
          </strong>

          <small>
            Manage people to contact during an
            emergency
          </small>
        </button>

        <button className="secondary-tile">
          <strong>Help & Support</strong>

          <small>
            App support and assistance
          </small>
        </button>

        <button
          className="secondary-tile"
          onClick={handleLogout}
        >
          <strong>Logout</strong>

          <small>
            Sign out from your account
          </small>
        </button>

        <div className="bottom-nav">
          <button
            onClick={() =>
              navigate('/dashboard')
            }
          >
            <span className="nav-icon">
              ⌂
            </span>
            Home
          </button>

          <button
            onClick={() =>
              navigate('/history')
            }
          >
            <span className="nav-icon">
              ◷
            </span>
            History
          </button>

          <button
            onClick={() =>
              navigate(
                '/emergency?type=medical',
              )
            }
          >
            <span className="nav-icon">
              ◎
            </span>
            Request
          </button>

          <button className="nav-active">
            <span className="nav-icon">
              ◉
            </span>
            Profile
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile