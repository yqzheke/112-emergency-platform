import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import OperatorRoute from './components/OperatorRoute'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'

import Dashboard from './pages/Dashboard'
import EmergencyConfirm from './pages/EmergencyConfirm'
import EmergencyContacts from './pages/EmergencyContacts'
import EmergencyHistory from './pages/EmergencyHistory'
import EmergencyRequest from './pages/EmergencyRequest'
import EmergencyStatus from './pages/EmergencyStatus'
import ForgotPassword from './pages/ForgotPassword'
import Login from './pages/Login'
import OperatorDashboard from './pages/OperatorDashboard'
import Profile from './pages/Profile'
import Register from './pages/Register'

import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH */}

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        {/* USER APP */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/emergency"
          element={
            <ProtectedRoute>
              <EmergencyRequest />
            </ProtectedRoute>
          }
        />

        <Route
          path="/emergency/confirm"
          element={
            <ProtectedRoute>
              <EmergencyConfirm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/emergency/status"
          element={
            <ProtectedRoute>
              <EmergencyStatus />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <EmergencyHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contacts"
          element={
            <ProtectedRoute>
              <EmergencyContacts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* OPERATOR */}

        <Route
          path="/operator"
          element={
            <OperatorRoute>
              <OperatorDashboard />
            </OperatorRoute>
          }
        />

        {/* FALLBACK */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App