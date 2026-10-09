import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Avatar from './Avatar'

export default function Navbar() {
  const { user } = useAuth()

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo">
          LIFT UP
        </Link>
        <nav className="nav-links">
          <NavLink to="/" end>
            Inicio
          </NavLink>
          <NavLink to="/nueva-sesion">Nueva sesión</NavLink>
          <NavLink to="/perfil" className="nav-profile">
            <Avatar src={user.avatar} size={24} />
            <span>Perfil</span>
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
