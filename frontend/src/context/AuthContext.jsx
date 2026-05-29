import React, { createContext, useState, useEffect, useContext } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || sessionStorage.getItem('token')
  })

  useEffect(() => {
    const isGuestSession = 
      localStorage.getItem('isGuest') === 'true' || 
      sessionStorage.getItem('isGuest') === 'true'
    if (isGuestSession) {
      setUser({
        isGuest: true,
        fullName: 'Guest Student',
        email: 'guest@studyhub.com',
        level: '100',
        faculty: 'Science & Tech',
        department: 'Computer Science'
      })
      setLoading(false)
    } else if (token) {
      loadUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const loadUser = async () => {
    try {
      const response = await authAPI.getMe()
      setUser(response.data)
    } catch (error) {
      console.error('Error loading user:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const loginAsGuest = (rememberMe = false) => {
    const guestUser = {
      isGuest: true,
      fullName: 'Guest Student',
      email: 'guest@studyhub.com',
      level: '100',
      faculty: 'Science & Tech',
      department: 'Computer Science'
    }
    setUser(guestUser)
    setToken('guest-token')
    
    if (rememberMe) {
      localStorage.setItem('token', 'guest-token')
      localStorage.setItem('isGuest', 'true')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('isGuest')
    } else {
      sessionStorage.setItem('token', 'guest-token')
      sessionStorage.setItem('isGuest', 'true')
      localStorage.removeItem('token')
      localStorage.removeItem('isGuest')
    }
  }

  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await authAPI.login({ email, password })
      const { token: newToken, ...userData } = response.data
      setToken(newToken)
      
      if (rememberMe) {
        localStorage.setItem('token', newToken)
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('isGuest')
        localStorage.removeItem('isGuest')
      } else {
        sessionStorage.setItem('token', newToken)
        localStorage.removeItem('token')
        localStorage.removeItem('isGuest')
        sessionStorage.removeItem('isGuest')
      }
      
      setUser(userData)
      return { success: true }
    } catch (error) {
      // Handle validation errors
      if (error.response?.data?.errors) {
        const firstError = error.response.data.errors[0]
        return {
          success: false,
          message: firstError.msg || firstError.message || 'Login failed',
        }
      }
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed',
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData)
      const { token: newToken, ...userInfo } = response.data
      setToken(newToken)
      localStorage.setItem('token', newToken)
      setUser(userInfo)
      return { success: true }
    } catch (error) {
      // Handle validation errors
      if (error.response?.data?.errors) {
        const firstError = error.response.data.errors[0]
        return {
          success: false,
          message: firstError.msg || firstError.message || 'Registration failed',
        }
      }
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Registration failed',
      }
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('isGuest')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('isGuest')
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    loginAsGuest,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

