// Validacion y procesamiento de archivos (fotos y videos)

export const MAX_POST_MEDIA_MB = 50

const PROFILE_TYPES = ['image/jpeg', 'image/png']
const POST_TYPES = ['image/jpeg', 'image/png', 'video/mp4']

function getExtension(file) {
  return file.name.split('.').pop().toLowerCase()
}

// Solo JPG y PNG para la foto de perfil
export function isValidProfileImage(file) {
  const okExt = ['jpg', 'jpeg', 'png'].includes(getExtension(file))
  return PROFILE_TYPES.includes(file.type) && okExt
}

// JPG, PNG o MP4 para las sesiones
export function isValidPostMedia(file) {
  const okExt = ['jpg', 'jpeg', 'png', 'mp4'].includes(getExtension(file))
  return POST_TYPES.includes(file.type) && okExt
}

export function isTooBig(file) {
  return file.size > MAX_POST_MEDIA_MB * 1024 * 1024
}

export function getMediaType(file) {
  return file.type.startsWith('video/') ? 'video' : 'image'
}

// Recorta la imagen en cuadrado y la reduce para que quepa en localStorage
export function resizeImageToDataUrl(file, size = 256) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('No se pudo leer la imagen'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('No se pudo procesar la imagen'))
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, size, size)
        const side = Math.min(img.width, img.height)
        const sx = (img.width - side) / 2
        const sy = (img.height - side) / 2
        ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size)
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
