import axios from 'axios'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const authContext = createContext()
const API = 'https://note-dacr.onrender.com'

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const login = (userData, token) => {
    // Restore saved avatar if exists
    const savedAvatar = localStorage.getItem('userAvatar')
    const enriched = savedAvatar ? { ...userData, avatar: savedAvatar } : userData
    setUser(enriched)
    localStorage.setItem('token', token)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userAvatar')
    setUser(null)
    toast.success('Logged out')
  }

  // updateUser: also persist avatar changes to localStorage
  const updateUser = (userData) => {
    setUser(userData)
    if (userData.avatar) {
      localStorage.setItem('userAvatar', userData.avatar)
    }
  }

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) { setLoading(false); return }
      try {
        const res = await axios.get(`${API}/api/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.data.success) {
          // Restore avatar from localStorage so it survives refresh
          const savedAvatar = localStorage.getItem('userAvatar')
          const enriched = savedAvatar
            ? { ...res.data.user, avatar: savedAvatar }
            : res.data.user
          setUser(enriched)
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    verifyUser()
  }, [])

  return (
    <authContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </authContext.Provider>
  )
}

export const useAuth = () => useContext(authContext)
export default ContextProvider
