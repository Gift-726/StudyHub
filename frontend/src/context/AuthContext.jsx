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
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
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

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password })
      const { token: newToken, ...userData } = response.data
      setToken(newToken)
      localStorage.setItem('token', newToken)
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
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

