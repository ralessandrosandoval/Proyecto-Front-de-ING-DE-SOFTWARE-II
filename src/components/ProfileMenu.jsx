import { useState } from 'react'
import { Link } from 'react-router-dom'

// Menu desplegable del perfil: editar perfil y cerrar sesion
export default function ProfileMenu({ onLogout }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="menu">
      <button className="btn btn-secondary" onClick={() => setOpen(!open)}>
        Menú ▾
      </button>
      {open && (
        <ul className="menu-list">
          <li>
            <Link to="/perfil/editar">Editar perfil</Link>
          </li>
          <li>
            <button
              onClick={() => {
                setOpen(false)
                onLogout()
              }}
            >
              Cerrar sesión
            </button>
          </li>
        </ul>
      )}
    </div>
  )
}
