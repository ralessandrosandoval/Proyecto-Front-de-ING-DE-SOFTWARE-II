// Servicio de usuarios (perfil y seguidores)
import { KEYS, read, write, delay } from './storage'
import { toPublicUser } from './authService'

export function getUserById(id) {
  const user = read(KEYS.users, []).find((u) => u.id === id)
  return toPublicUser(user)
}

export async function updateProfile(userId, { name, level, bio, avatar }) {
  await delay(500)
  const users = read(KEYS.users, [])
  const index = users.findIndex((u) => u.id === userId)
  if (index === -1) throw new Error('Usuario no encontrado')

  users[index] = { ...users[index], name: name.trim(), level, bio: bio.trim(), avatar }
  try {
    write(KEYS.users, users)
  } catch {
    throw new Error('No se pudo guardar el perfil, intenta con otra imagen')
  }
  return toPublicUser(users[index])
}

// Si ya lo sigue lo deja de seguir, y si no, lo empieza a seguir
export function toggleFollow(userId, targetId) {
  const users = read(KEYS.users, [])
  const index = users.findIndex((u) => u.id === userId)
  if (index === -1) throw new Error('Usuario no encontrado')

  const following = users[index].following || []
  const newFollowing = following.includes(targetId)
    ? following.filter((id) => id !== targetId)
    : [...following, targetId]

  users[index] = { ...users[index], following: newFollowing }
  write(KEYS.users, users)
  return toPublicUser(users[index])
}
