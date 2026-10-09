// Datos de ejemplo que se cargan la primera vez que se abre la app
import { KEYS, read, write, remove } from '../services/storage'
import { hashPassword } from '../services/authService'
import { clearMedia } from '../services/mediaService'

const HOUR = 60 * 60 * 1000
const hoursAgo = (h) => new Date(Date.now() - h * HOUR).toISOString()

// Todos tienen la contraseña: password123
const seedUsers = [
  {
    id: 'u_ana',
    name: 'Ana Torres',
    email: 'ana@liftup.com',
    level: 'Intermedio',
    bio: 'Empecé hace un año. Cada semana un poco mejor que la anterior.',
  },
  {
    id: 'u_carlos',
    name: 'Carlos Ruiz',
    email: 'carlos@liftup.com',
    level: 'Avanzado',
    bio: 'Powerlifting y mucho café.',
  },
  {
    id: 'u_lucia',
    name: 'Lucía Paredes',
    email: 'lucia@liftup.com',
    level: 'Principiante',
    bio: 'Recién empezando, sin presión.',
  },
].map((u) => ({
  ...u,
  passwordHash: hashPassword('password123'),
  avatar: null,
  following: [],
  createdAt: hoursAgo(500),
}))

const seedPosts = [
  { authorId: 'u_carlos', key: 'seed-1', hours: 1, text: 'Nuevo récord personal en peso muerto. Paciencia y constancia.' },
  { authorId: 'u_ana', key: 'seed-2', hours: 3, text: 'Primer 5K sin parar. Hace seis meses no podía correr ni 1 km.' },
  { authorId: 'u_lucia', key: 'seed-3', hours: 6, text: 'Mi primera semana usando kettlebell. Todavía me tiemblan los brazos.' },
  { authorId: 'u_ana', key: 'seed-1', hours: 10, text: 'Día de piernas completado. Mañana no sé si podré bajar las escaleras.' },
  { authorId: 'u_carlos', key: 'seed-3', hours: 20, text: 'Rutina de hombros y core. 4 series de cada ejercicio.' },
  { authorId: 'u_lucia', key: 'seed-2', hours: 30, text: 'Caminata larga al aire libre. Lo importante es moverse.' },
  { authorId: 'u_carlos', key: 'seed-2', hours: 48, text: 'Cardio suave de recuperación después de la competencia.' },
  { authorId: 'u_ana', key: 'seed-3', hours: 60, text: 'Probando rutinas nuevas con kettlebell para variar.' },
  { authorId: 'u_lucia', key: 'seed-1', hours: 80, text: 'Aprendiendo la técnica del peso muerto con barra vacía. Ir lento es ir seguro.' },
].map((p, i) => ({
  id: 'p_seed_' + (i + 1),
  authorId: p.authorId,
  description: p.text,
  media: { source: 'seed', id: p.key, type: 'image' },
  createdAt: hoursAgo(p.hours),
  updatedAt: null,
}))

export function initSeedData() {
  if (read(KEYS.seeded, false)) return
  write(KEYS.users, seedUsers)
  write(KEYS.posts, seedPosts)
  write(KEYS.seeded, true)
}

// Borra todo y vuelve a dejar los datos de ejemplo
export async function resetAllData() {
  await clearMedia()
  remove(KEYS.users)
  remove(KEYS.posts)
  remove(KEYS.token)
  remove(KEYS.seeded)
  initSeedData()
}
