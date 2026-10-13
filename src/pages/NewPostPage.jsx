import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePosts } from '../context/PostsContext'
import FormField from '../components/FormField'
import ProgressBar from '../components/ProgressBar'
import { isTooBig, isValidPostMedia, MAX_POST_MEDIA_MB } from '../services/fileService'

export default function NewPostPage() {
  const { addPost } = usePosts()
  const navigate = useNavigate()

  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState({})
  const [uploadError, setUploadError] = useState('')
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [simulateError, setSimulateError] = useState(false)

  // Libera la memoria de la vista previa
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function handleFileChange(e) {
    const selected = e.target.files[0]
    e.target.value = ''
    if (!selected) return

    setUploadError('')
    if (!isValidPostMedia(selected)) {
      setErrors((prev) => ({ ...prev, file: 'Formato no permitido' }))
      setFile(null)
      setPreviewUrl(null)
      return
    }
    if (isTooBig(selected)) {
      setErrors((prev) => ({ ...prev, file: `El archivo supera los ${MAX_POST_MEDIA_MB} MB` }))
      setFile(null)
      setPreviewUrl(null)
      return
    }

    setErrors((prev) => ({ ...prev, file: '' }))
    setFile(selected)
    setPreviewUrl(URL.createObjectURL(selected))
  }

  async function publish() {
    setUploadError('')
    setProgress(0)
    setUploading(true)
    try {
      await addPost({ file, description, onProgress: setProgress, simulateError })
      navigate('/')
    } catch (err) {
      // Si fallo por la opcion de prueba, la desactiva para que el reintento funcione
      setSimulateError(false)
      setUploadError(err.message)
      setUploading(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const newErrors = {}
    if (!file) newErrors.file = errors.file || 'Selecciona una imagen o un video'
    if (!description.trim()) newErrors.description = 'Escribe una descripción de tu sesión'
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return
    publish()
  }

  const isVideo = file && file.type.startsWith('video/')

  return (
    <div>
      <h1>Nueva sesión</h1>

      <form className="card" onSubmit={handleSubmit} noValidate>
        <FormField label="Foto o video (JPG, PNG o MP4)" htmlFor="media" error={errors.file}>
          <input
            id="media"
            type="file"
            accept=".jpg,.jpeg,.png,.mp4,image/jpeg,image/png,video/mp4"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </FormField>

        {previewUrl &&
          (isVideo ? (
            <video className="media preview" src={previewUrl} controls />
          ) : (
            <img className="media preview" src={previewUrl} alt="Vista previa" />
          ))}

        <FormField label="Descripción" htmlFor="description" error={errors.description}>
          <textarea
            id="description"
            rows="4"
            maxLength={500}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="¿Cómo te fue en tu entrenamiento de hoy?"
            disabled={uploading}
          />
        </FormField>

        <label className="checkbox small">
          <input
            type="checkbox"
            checked={simulateError}
            onChange={(e) => setSimulateError(e.target.checked)}
            disabled={uploading}
          />
          Simular error de red (solo para pruebas)
        </label>

        {uploading && <ProgressBar value={progress} />}

        {uploadError && (
          <div className="alert" role="alert">
            <p>{uploadError}</p>
            <button type="button" className="btn btn-small" onClick={publish}>
              Reintentar
            </button>
          </div>
        )}

        <div className="form-actions">
          <Link to="/" className="btn btn-secondary">
            Cancelar
          </Link>
          <button className="btn" type="submit" disabled={uploading}>
            {uploading ? 'Subiendo...' : 'Publicar'}
          </button>
        </div>
      </form>
    </div>
  )
}
