import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import FormField from '../components/FormField'
import { validateEmail } from '../services/validators'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')

    const newErrors = {}
    const emailError = validateEmail(email)
    if (emailError) newErrors.email = emailError
    if (!password) newErrors.password = 'Ingresa tu contraseña'
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    try {
      await login({ email, password })
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setServerError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h1 className="auth-title">LIFT UP</h1>
        <p className="small center">Red social fitness inclusiva</p>
        <h2>Iniciar sesión</h2>

        <form onSubmit={handleSubmit} noValidate>
          <FormField label="Correo" htmlFor="email" error={errors.email}>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              disabled={loading}
            />
          </FormField>

          <FormField label="Contraseña" htmlFor="password" error={errors.password}>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              disabled={loading}
            />
          </FormField>

          {serverError && <p className="alert" role="alert">{serverError}</p>}

          <button className="btn btn-block" type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="center small">
          ¿No tienes cuenta? <Link to="/registro" className="link">Regístrate</Link>
        </p>
      </div>
    </div>
  )
}
