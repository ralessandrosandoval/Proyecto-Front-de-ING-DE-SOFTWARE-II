// Servicio de autenticacion (simula un backend con localStorage)
import { KEYS, read, write, remove, delay, generateId } from './storage'

const TOKEN_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 dias

// Solo para simular. En un backend real se usaria bcrypt, nunca esto.
export function hashPassword(password) {
  return btoa(unescape(encodeURIComponent('liftup::' + password)))
}

export function toPublicUser(user) {
  if (!user) return null
  // eslint-disable-next-line no-unused-vars
  const { passwordHash, ...publicUser } = user
  return publicUser
}

// Crea un "JWT" falso: header.payload.firma
function createToken(userId) {
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({ sub: userId, exp: Date.now() + TOKEN_DURATION_MS }))
  return `${header}.${payload}.fake-signature`
}

function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

export async function register({ name, email, password }) {
  await delay(600)
  const users = read(KEYS.users, [])
  const cleanEmail = email.trim().toLowerCase()

  if (users.some((u) => u.email === cleanEmail)) {
    throw new Error('Este correo ya está registrado')
  }

  const newUser = {
    id: generateId(),
    name: name.trim(),
    email: cleanEmail,
    passwordHash: hashPassword(password),
    level: 'Principiante',
    bio: '',
    avatar: null,
    following: [],
    createdAt: new Date().toISOString(),
  }

  write(KEYS.users, [...users, newUser])
  write(KEYS.token, createToken(newUser.id))
  return toPublicUser(newUser)
}

export async function login({ email, password }) {
  await delay(600)
  const users = read(KEYS.users, [])
  const cleanEmail = email.trim().toLowerCase()
  const user = users.find((u) => u.email === cleanEmail)

  if (!user || user.passwordHash !== hashPassword(password)) {
    throw new Error('Usuario o contraseña incorrectos')
  }

  write(KEYS.token, createToken(user.id))
  return toPublicUser(user)
}

// Elimina el token del dispositivo
export function logout() {
  remove(KEYS.token)
}

// Revisa si hay una sesion guardada y valida (token vigente y usuario existente)
export function getSessionUser() {
  const token = read(KEYS.token, null)
  if (!token) return null

  const payload = decodeToken(token)
  if (!payload || payload.exp < Date.now()) {
    remove(KEYS.token)
    return null
  }

  const user = read(KEYS.users, []).find((u) => u.id === payload.sub)
  if (!user) {
    remove(KEYS.token)
    return null
  }
  return toPublicUser(user)
}
