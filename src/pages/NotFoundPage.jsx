import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="auth-page">
      <div className="card auth-card center">
        <h1>404</h1>
        <p>Esta página no existe.</p>
        <Link to="/" className="btn">
          Ir al inicio
        </Link>
      </div>
    </div>
  )
}
