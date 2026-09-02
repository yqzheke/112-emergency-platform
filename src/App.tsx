import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import OperatorRoute from './components/OperatorRoute'
import PublicRoute from './components/PublicRoute'

import Login from './pages/Login'
import OperatorDashboard from './pages/OperatorDashboard'

import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* OPERATOR LOGIN */}

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* OPERATOR CONTROL CENTER */}

        <Route
          path="/operator"
          element={
            <OperatorRoute>
              <OperatorDashboard />
            </OperatorRoute>
          }
        />

        {/* DEFAULT */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
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