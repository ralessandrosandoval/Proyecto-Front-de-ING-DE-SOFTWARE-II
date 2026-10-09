// Funciones base para trabajar con localStorage (simula la base de datos)

export const KEYS = {
  users: 'liftup_users',
  posts: 'liftup_posts',
  token: 'liftup_token',
  seeded: 'liftup_seeded_v1',
}

export function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

// Puede lanzar error si se llena el localStorage (quota exceeded)
export function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function remove(key) {
  localStorage.removeItem(key)
}

// Simula la latencia de un servidor real
export function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
