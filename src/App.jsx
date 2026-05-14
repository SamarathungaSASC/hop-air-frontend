import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { AuthProvider, useCurrentUser } from './context/AuthContext'

import LoginPage from './pages/LoginPage'
import LoadingScreen from './components/LoadingScreen'

// Role dashboards
import SuperadminDashboard from './pages/superadmin/Dashboard'
import EducatorDashboard from './pages/educator/Dashboard'
import StaffDashboard from './pages/StaffDashboard'

function RoleRouter() {
  const { isAuthenticated, isLoading: auth0Loading } = useAuth0()
  const { currentUser, userLoading } = useCurrentUser()

  if (auth0Loading || userLoading) return <LoadingScreen />
  if (!isAuthenticated) return <LoginPage />
  if (!currentUser) return <LoadingScreen message="Setting up your account..." />

  switch (currentUser.role) {
    case 'SUPERADMIN': return <SuperadminDashboard />
    case 'EDUCATOR':   return <EducatorDashboard />
    case 'CLINICIAN':
    case 'TRAINEE':    return <StaffDashboard />
    default:           return <div className="p-8 text-red-400">Unknown role: {currentUser.role}</div>
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<RoleRouter />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
