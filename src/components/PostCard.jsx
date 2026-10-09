import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { formatDate } from '../services/formatters'
import Avatar from './Avatar'
import MediaView from './MediaView'

export default function PostCard({ post }) {
  const { user, toggleFollow } = useAuth()
  const { author } = post
  const isOwn = author.id === user.id
  const isFollowing = (user.following || []).includes(author.id)
  const canLink = author.id !== 'deleted'

  return (
    <article className="card post-card">
      <div className="post-header">
        <Avatar src={author.avatar} size={40} />
        <div className="post-author">
          {canLink ? (
            <Link to={isOwn ? '/perfil' : `/usuario/${author.id}`} className="author-name">
              {author.name}
            </Link>
          ) : (
            <span className="author-name">{author.name}</span>
          )}
          <span className="small">
            {author.level && `${author.level} · `}
            {formatDate(post.createdAt)}
            {post.updatedAt && ' · editado'}
          </span>
        </div>
        {!isOwn && canLink && (
          <button
            className={isFollowing ? 'btn btn-small btn-secondary' : 'btn btn-small'}
            onClick={() => toggleFollow(author.id)}
          >
            {isFollowing ? 'Siguiendo' : 'Seguir'}
          </button>
        )}
      </div>

      <Link to={`/publicacion/${post.id}`}>
        <MediaView media={post.media} />
      </Link>

      <p className="post-text">{post.description}</p>
      <Link to={`/publicacion/${post.id}`} className="small link">
        Ver detalle
      </Link>
    </article>
  )
}
