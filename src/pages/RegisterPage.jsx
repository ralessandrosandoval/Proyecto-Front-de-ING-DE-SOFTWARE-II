import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import FormField from '../components/FormField'
import { validateEmail, validateName, validatePassword } from '../services/validators'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')

    const newErrors = {}
    const nameError = validateName(name)
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)
    if (nameError) newErrors.name = nameError
    if (emailError) newErrors.email = emailError
    if (passwordError) newErrors.password = passwordError
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    try {
      await register({ name, email, password })
      navigate('/', { replace: true })
    } catch (err) {
      setServerError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h1 className="auth-title">LIFT UP</h1>
        <p className="small center">Tu progreso se mide contra ti mismo</p>
        <h2>Crear cuenta</h2>

        <form onSubmit={handleSubmit} noValidate>
          <FormField label="Nombre" htmlFor="name" error={errors.name}>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              disabled={loading}
            />
          </FormField>

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
              placeholder="Mínimo 8 caracteres"
              disabled={loading}
            />
          </FormField>

          {serverError && <p className="alert" role="alert">{serverError}</p>}

          <button className="btn btn-block" type="submit" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Registrarme'}
          </button>
        </form>

        <p className="center small">
          ¿Ya tienes cuenta? <Link to="/login" className="link">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
