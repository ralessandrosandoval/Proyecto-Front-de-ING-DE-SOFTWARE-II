import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import * as postService from '../services/postService'
import { delay } from '../services/storage'

const PostsContext = createContext(null)

export function PostsProvider({ children }) {
  const { user } = useAuth()
  const [posts, setPosts] = useState(() => postService.getPosts())

  const reloadPosts = useCallback(() => {
    setPosts(postService.getPosts())
  }, [])

  // Se recargan cuando cambia el usuario (login, logout o cambio de perfil)
  useEffect(() => {
    reloadPosts()
  }, [user, reloadPosts])

  // Refresco manual (deslizar hacia abajo): simula una espera corta
  const refreshPosts = useCallback(async () => {
    await delay(800)
    reloadPosts()
  }, [reloadPosts])

  async function addPost({ file, description, onProgress, simulateError }) {
    await postService.createPost({ authorId: user.id, file, description, onProgress, simulateError })
    reloadPosts()
  }

  async function editPost(postId, description) {
    await postService.updatePost(postId, user.id, description)
    reloadPosts()
  }

  async function removePost(postId) {
    await postService.deletePost(postId, user.id)
    reloadPosts()
  }

  async function clearPosts() {
    await postService.clearAllPosts()
    reloadPosts()
  }

  const value = { posts, reloadPosts, refreshPosts, addPost, editPost, removePost, clearPosts }
  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>
}

export function usePosts() {
  return useContext(PostsContext)
}
