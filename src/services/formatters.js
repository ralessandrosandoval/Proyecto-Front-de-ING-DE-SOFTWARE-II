// Funciones para mostrar datos de forma legible

export function formatDate(isoString) {
  const date = new Date(isoString)
  return date.toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
