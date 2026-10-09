// Validaciones de formularios. Devuelven un texto de error o '' si todo esta bien.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email) {
  if (!email.trim()) return 'Ingresa tu correo'
  if (!EMAIL_REGEX.test(email.trim())) return 'Formato de correo inválido'
  return ''
}

export function validatePassword(password) {
  if (!password) return 'Ingresa tu contraseña'
  if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres'
  return ''
}

export function validateName(name) {
  if (!name.trim()) return 'El nombre no puede estar vacío'
  return ''
}
