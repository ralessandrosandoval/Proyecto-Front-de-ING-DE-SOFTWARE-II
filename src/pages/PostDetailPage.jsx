import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePosts } from '../context/PostsContext'
import { formatDate } from '../services/formatters'
import Avatar from '../components/Avatar'
import ConfirmModal from '../components/ConfirmModal'
import MediaView from '../components/MediaView'

export default function PostDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { posts, editPost, removePost } = usePosts()
  const navigate = useNavigate()

  const post = posts.find((p) => p.id === id)

  const [editing, setEditing] = useState(false)
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (!post) {
    return (
      <div className="card">
        <p>La publicación no existe o fue eliminada.</p>
        <Link to="/" className="btn">
          Volver al inicio
        </Link>
      </div>
    )
  }

  const isOwn = post.author.id === user.id

  function startEditing() {
    setText(post.description)
    setError('')
    setMessage('')
    setEditing(true)
  }

  async function handleSave() {
    if (!text.trim()) {
      setError('La descripción no puede estar vacía')
      return
    }
    setSaving(true)
    try {
      await editPost(post.id, text)
      setEditing(false)
      setMessage('Cambios guardados')
    } catch (err) {
      setError(err.message)
    }
    setSaving(false)
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await removePost(post.id)
      navigate('/', { replace: true })
    } catch (err) {
      setShowDelete(false)
      setDeleting(false)
      setError(err.message)
    }
  }

  return (
    <div>
      <Link to="/" className="link small">
        ← Volver al inicio
      </Link>

      <article className="card post-card">
        <div className="post-header">
          <Avatar src={post.author.avatar} size={40} />
          <div className="post-author">
            <span className="author-name">{post.author.name}</span>
            <span className="small">
              {formatDate(post.createdAt)}
              {post.updatedAt && ` · editado ${formatDate(post.updatedAt)}`}
            </span>
          </div>
        </div>

        <MediaView media={post.media} />

        {message && <p className="notice">{message}</p>}
        {error && !editing && <p className="alert">{error}</p>}

        {editing ? (
          <div>
            <textarea rows="4" maxLength={500} value={text} onChange={(e) => setText(e.target.value)} disabled={saving} />
            {error && <p className="field-error">{error}</p>}
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={() => setEditing(false)} disabled={saving}>
                Cancelar
              </button>
              <button className="btn" onClick={handleSave} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="post-text">{post.description}</p>
            {isOwn && (
              <div className="form-actions">
                <button className="btn btn-secondary" onClick={startEditing}>
                  Editar descripción
                </button>
                <button className="btn" onClick={() => setShowDelete(true)}>
                  Eliminar
                </button>
              </div>
            )}
          </>
        )}
      </article>

      {showDelete && (
        <ConfirmModal
          title="Eliminar publicación"
          message="¿Seguro que quieres eliminar esta publicación? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  )
}
