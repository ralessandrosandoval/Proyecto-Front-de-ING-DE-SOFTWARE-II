import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePosts } from '../context/PostsContext'
import { getUserById } from '../services/userService'
import { resetAllData } from '../data/seed'
import Avatar from '../components/Avatar'
import ConfirmModal from '../components/ConfirmModal'
import PostCard from '../components/PostCard'
import ProfileMenu from '../components/ProfileMenu'

// Sirve para el perfil propio (/perfil) y para el de otros usuarios (/usuario/:id)
export default function ProfilePage() {
  const { id } = useParams()
  const { user, logout, toggleFollow } = useAuth()
  const { posts, clearPosts } = usePosts()
  const navigate = useNavigate()
  const location = useLocation()

  const [showLogout, setShowLogout] = useState(false)
  const [tool, setTool] = useState(null) // 'clear' | 'reset' | null
  const [working, setWorking] = useState(false)

  const isOwn = !id || id === user.id
  const profile = isOwn ? user : getUserById(id)

  if (!profile) {
    return (
      <div className="card">
        <p>Este usuario no existe.</p>
        <Link to="/" className="btn">
          Volver al inicio
        </Link>
      </div>
    )
  }

  const userPosts = posts.filter((p) => p.author.id === profile.id)
  const isFollowing = (user.following || []).includes(profile.id)

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  async function handleTool() {
    setWorking(true)
    if (tool === 'clear') {
      await clearPosts()
      setTool(null)
      setWorking(false)
    } else {
      await resetAllData()
      window.location.href = '/login'
    }
  }

  return (
    <div>
      {location.state?.message && <p className="notice">{location.state.message}</p>}

      <section className="card profile-header">
        <Avatar src={profile.avatar} size={96} />
        <div className="profile-info">
          <h1>{profile.name}</h1>
          <p className="badge">{profile.level}</p>
          <p>{profile.bio || (isOwn ? 'Aún no has escrito tu biografía.' : 'Sin biografía.')}</p>
          <p className="small">
            {userPosts.length} publicaciones · {(profile.following || []).length} siguiendo
          </p>
        </div>

        {isOwn ? (
          <ProfileMenu onLogout={() => setShowLogout(true)} />
        ) : (
          <button className={isFollowing ? 'btn btn-secondary' : 'btn'} onClick={() => toggleFollow(profile.id)}>
            {isFollowing ? 'Siguiendo' : 'Seguir'}
          </button>
        )}
      </section>

      <h2>Sesiones</h2>
      {userPosts.length === 0 ? (
        <p className="empty">
          {isOwn ? 'Aún no has publicado sesiones.' : 'Este usuario aún no ha publicado sesiones.'}
        </p>
      ) : (
        <div className="post-list">
          {userPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {isOwn && (
        <details className="card dev-tools">
          <summary>Herramientas de prueba</summary>
          <p className="small">Sirven para probar la app (por ejemplo el feed vacío).</p>
          <div className="form-actions">
            <button className="btn btn-secondary btn-small" onClick={() => setTool('clear')}>
              Vaciar publicaciones
            </button>
            <button className="btn btn-secondary btn-small" onClick={() => setTool('reset')}>
              Restablecer datos de ejemplo
            </button>
          </div>
        </details>
      )}

      {showLogout && (
        <ConfirmModal
          title="Cerrar sesión"
          message="¿Seguro que quieres cerrar sesión?"
          confirmText="Cerrar sesión"
          onConfirm={handleLogout}
          onCancel={() => setShowLogout(false)}
        />
      )}

      {tool && (
        <ConfirmModal
          title={tool === 'clear' ? 'Vaciar publicaciones' : 'Restablecer datos'}
          message={
            tool === 'clear'
              ? 'Se borrarán todas las publicaciones de la plataforma.'
              : 'Se borrarán todos los datos (cuentas y publicaciones) y volverán los de ejemplo. Tendrás que iniciar sesión otra vez.'
          }
          confirmText="Continuar"
          loading={working}
          onConfirm={handleTool}
          onCancel={() => setTool(null)}
        />
      )}
    </div>
  )
}
