import { useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { usePosts } from '../context/PostsContext'
import PostList from '../components/PostList'
import PullToRefresh from '../components/PullToRefresh'

export default function FeedPage() {
  const { user } = useAuth()
  const { posts, refreshPosts } = usePosts()
  const [refreshing, setRefreshing] = useState(false)
  const [refreshCount, setRefreshCount] = useState(0)

  // Primero las publicaciones de usuarios que sigo, luego el resto. En cada grupo, la mas nueva primero.
  const sortedPosts = useMemo(() => {
    const following = user.following || []
    return [...posts].sort((a, b) => {
      const aFollowed = following.includes(a.author.id) ? 1 : 0
      const bFollowed = following.includes(b.author.id) ? 1 : 0
      if (aFollowed !== bFollowed) return bFollowed - aFollowed
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }, [posts, user.following])

  async function handleRefresh() {
    if (refreshing) return
    setRefreshing(true)
    await refreshPosts()
    setRefreshCount((c) => c + 1) // reinicia la lista (vuelve a mostrar desde el principio)
    setRefreshing(false)
  }

  return (
    <PullToRefresh onRefresh={handleRefresh} refreshing={refreshing}>
      <div className="page-header">
        <h1>Inicio</h1>
        <button className="btn btn-secondary btn-small" onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>
      <PostList key={refreshCount} posts={sortedPosts} />
    </PullToRefresh>
  )
}
