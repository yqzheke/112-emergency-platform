import { useNavigate } from 'react-router-dom'

import { getStoredUser } from '../lib/auth'

function Dashboard() {
  const navigate = useNavigate()

  const user = getStoredUser()
  const firstName =
    user?.fullName.split(' ')[0] || 'User'

  return (
    <div className="mobile-shell">
      <div className="top-bar-space" />

      <div className="page-content">
        <div className="mobile-header">
          <div>
            <p className="greeting">
              Hey {firstName},
            </p>

            <p className="greeting-sub">
              We’re here for you.
            </p>
          </div>

          <button
            className="icon-circle"
            onClick={() => navigate('/profile')}
            aria-label="Open profile"
          >
            ⚙
          </button>
        </div>

        <p className="section-title">
          Emergency assistance
        </p>

        <button
          className="secondary-tile"
          onClick={() =>
            navigate('/emergency?type=medical')
          }
        >
          <strong>Emergency Assistance</strong>
          <small>
            Start a guided emergency request
          </small>
        </button>

        <p className="section-title">
          One click emergency assistance
        </p>

        <button
          className="quick-action-card card-medical"
          onClick={() =>
            navigate('/emergency?type=medical')
          }
        >
          <div className="quick-action-left">
            <div className="quick-action-icon">
              ✚
            </div>

            <div>
              <strong>Medical Emergency</strong>
              <small>Ambulance assistance</small>
            </div>
          </div>

          <div>›</div>
        </button>

        <button
          className="quick-action-card card-police"
          onClick={() =>
            navigate('/emergency?type=police')
          }
        >
          <div className="quick-action-left">
            <div className="quick-action-icon">
              🛡
            </div>

            <div>
              <strong>Police Emergency</strong>
              <small>Police assistance</small>
            </div>
          </div>

          <div>›</div>
        </button>

        <button
          className="quick-action-card card-fire"
          onClick={() =>
            navigate('/emergency?type=fire')
          }
        >
          <div className="quick-action-left">
            <div className="quick-action-icon">
              🔥
            </div>

            <div>
              <strong>Fire Emergency</strong>
              <small>
                Fire and rescue assistance
              </small>
            </div>
          </div>

          <div>›</div>
        </button>

        <p className="section-title">
          More
        </p>

        <button
          className="secondary-tile"
          onClick={() => navigate('/history')}
        >
          <strong>Emergency History</strong>
          <small>
            Review your previous emergency requests
          </small>
        </button>

        <button
          className="secondary-tile"
          onClick={() => navigate('/profile')}
        >
          <strong>Profile & Settings</strong>
          <small>
            Account details and app preferences
          </small>
        </button>

        <div className="bottom-nav">
          <button className="nav-active">
            <span className="nav-icon">⌂</span>
            Home
          </button>

          <button
            onClick={() => navigate('/history')}
          >
            <span className="nav-icon">◷</span>
            History
          </button>

          <button
            onClick={() =>
              navigate('/emergency?type=medical')
            }
          >
            <span className="nav-icon">◎</span>
            Request
          </button>

          <button
            onClick={() => navigate('/profile')}
          >
            <span className="nav-icon">◉</span>
            Profile
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard