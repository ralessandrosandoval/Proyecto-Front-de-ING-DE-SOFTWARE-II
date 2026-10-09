import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Login y registro: si ya hay sesion iniciada, manda a la pantalla principal
export default function PublicRoute({ children }) {
  const { user } = useAuth()

  if (user) {
    return <Navigate to="/" replace />
  }
  return children
}
