import { useEffect, useState } from 'react'
import { getMedia } from '../services/mediaService'
import { seedMedia } from '../data/seedMedia'

// Muestra la foto o video de una publicacion.
// Las de ejemplo vienen de /assets y las de los usuarios de IndexedDB.
export default function MediaView({ media }) {
  const [url, setUrl] = useState(media.source === 'seed' ? seedMedia[media.id] : null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (media.source === 'seed') {
      setUrl(seedMedia[media.id])
      return
    }

    let objectUrl = null
    let cancelled = false

    getMedia(media.id)
      .then((blob) => {
        if (cancelled) return
        if (!blob) {
          setFailed(true)
          return
        }
        objectUrl = URL.createObjectURL(blob)
        setUrl(objectUrl)
      })
      .catch(() => !cancelled && setFailed(true))

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [media.source, media.id])

  if (failed) return <div className="media-placeholder">No se pudo cargar el archivo</div>
  if (!url) return <div className="media-placeholder">Cargando...</div>

  if (media.type === 'video') {
    return <video className="media" src={url} controls />
  }
  return <img className="media" src={url} alt="Sesión de entrenamiento" />
}
