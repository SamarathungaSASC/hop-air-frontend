import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { getMe, setAuthToken, clearAuthToken } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { isAuthenticated, isLoading, getAccessTokenSilently, logout } = useAuth0()
  const [currentUser, setCurrentUser] = useState(null)
  const [userLoading, setUserLoading]  = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) {
      clearAuthToken()
      setCurrentUser(null)
      setUserLoading(false)
      return
    }

    ;(async () => {
      try {
        const token = await getAccessTokenSilently()
        setAuthToken(token)
        const user = await getMe()
        setCurrentUser(user)
      } catch (err) {
        console.error('Failed to load user:', err)
        setError(err.message)
      } finally {
        setUserLoading(false)
      }
    })()
  }, [isAuthenticated, isLoading, getAccessTokenSilently])

  return (
    <AuthContext.Provider value={{ currentUser, userLoading, error, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useCurrentUser = () => useContext(AuthContext)
