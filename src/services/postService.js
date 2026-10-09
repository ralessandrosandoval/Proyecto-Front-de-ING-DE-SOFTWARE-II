// Servicio de publicaciones (sesiones de entrenamiento)
import { KEYS, read, write, delay, generateId } from './storage'
import { saveMedia, deleteMedia, clearMedia } from './mediaService'
import { getMediaType } from './fileService'
import { toPublicUser } from './authService'

export const NETWORK_ERROR = 'Error de red al subir el archivo. Intenta nuevamente.'

const DELETED_USER = { id: 'deleted', name: 'Usuario eliminado', level: '', avatar: null }

// Devuelve todas las publicaciones con los datos de su autor, de la mas nueva a la mas vieja
export function getPosts() {
  const posts = read(KEYS.posts, [])
  const users = read(KEYS.users, [])

  return posts
    .map((post) => ({
      ...post,
      author: toPublicUser(users.find((u) => u.id === post.authorId)) || DELETED_USER,
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

// Simula la subida del archivo con una barra de progreso
function simulateUpload(file, onProgress, simulateError) {
  const sizeMb = file.size / (1024 * 1024)
  const duration = Math.min(4000, 1500 + sizeMb * 300)
  const start = Date.now()

  return new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      const percent = Math.min(100, ((Date.now() - start) / duration) * 100)
      onProgress(Math.round(percent))

      if (simulateError && percent >= 60) {
        clearInterval(timer)
        reject(new Error(NETWORK_ERROR))
      } else if (percent >= 100) {
        clearInterval(timer)
        resolve()
      }
    }, 100)
  })
}

export async function createPost({ authorId, file, description, onProgress = () => {}, simulateError = false }) {
  await simulateUpload(file, onProgress, simulateError)

  let mediaId
  try {
    mediaId = await saveMedia(file)
  } catch {
    throw new Error(NETWORK_ERROR)
  }

  const post = {
    id: generateId(),
    authorId,
    description: description.trim(),
    media: { source: 'db', id: mediaId, type: getMediaType(file) },
    createdAt: new Date().toISOString(),
    updatedAt: null,
  }

  try {
    write(KEYS.posts, [post, ...read(KEYS.posts, [])])
  } catch {
    await deleteMedia(mediaId)
    throw new Error(NETWORK_ERROR)
  }
  return post
}

export async function updatePost(postId, authorId, description) {
  await delay(400)
  const posts = read(KEYS.posts, [])
  const index = posts.findIndex((p) => p.id === postId)
  if (index === -1) throw new Error('La publicación no existe')
  if (posts[index].authorId !== authorId) throw new Error('No puedes editar esta publicación')

  posts[index] = { ...posts[index], description: description.trim(), updatedAt: new Date().toISOString() }
  write(KEYS.posts, posts)
  return posts[index]
}

export async function deletePost(postId, authorId) {
  await delay(400)
  const posts = read(KEYS.posts, [])
  const post = posts.find((p) => p.id === postId)
  if (!post) throw new Error('La publicación no existe')
  if (post.authorId !== authorId) throw new Error('No puedes eliminar esta publicación')

  if (post.media?.source === 'db') await deleteMedia(post.media.id)
  write(KEYS.posts, posts.filter((p) => p.id !== postId))
}

// Solo para pruebas: borra todas las publicaciones
export async function clearAllPosts() {
  write(KEYS.posts, [])
  await clearMedia()
}
