import { useEffect, useRef, useState } from 'react'
import PostCard from './PostCard'

const PAGE_SIZE = 4

// Lista de publicaciones con scroll infinito: muestra de a 4 y carga mas al llegar al final
export default function PostList({ posts, emptyMessage = 'No hay publicaciones aún en la plataforma' }) {
  const [visible, setVisible] = useState(PAGE_SIZE)
  const sentinelRef = useRef(null)
  const hasMore = visible < posts.length

  useEffect(() => {
    const element = sentinelRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setVisible((v) => v + PAGE_SIZE)
      },
      { rootMargin: '100px' }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [visible, hasMore])

  if (posts.length === 0) {
    return <p className="empty">{emptyMessage}</p>
  }

  return (
    <div className="post-list">
      {posts.slice(0, visible).map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {hasMore ? (
        <div ref={sentinelRef} className="list-end">
          <button className="btn btn-secondary" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
            Cargando más publicaciones...
          </button>
        </div>
      ) : (
        <p className="list-end small">No hay más publicaciones</p>
      )}
    </div>
  )
}
