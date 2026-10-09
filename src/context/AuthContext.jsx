import { createContext, useContext, useState } from 'react'
import * as authService from '../services/authService'
import * as userService from '../services/userService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Al abrir la app se revisa si ya habia una sesion guardada (sesion persistente)
  const [user, setUser] = useState(() => authService.getSessionUser())

  async function register(data) {
    const newUser = await authService.register(data)
    setUser(newUser)
  }

  async function login(data) {
    const loggedUser = await authService.login(data)
    setUser(loggedUser)
  }

  function logout() {
    authService.logout()
    setUser(null)
  }

  async function updateProfile(data) {
    const updated = await userService.updateProfile(user.id, data)
    setUser(updated)
  }

  function toggleFollow(targetId) {
    const updated = userService.toggleFollow(user.id, targetId)
    setUser(updated)
  }

  const value = { user, register, login, logout, updateProfile, toggleFollow }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
