import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LEVELS } from '../data/levels'
import { isValidProfileImage, resizeImageToDataUrl } from '../services/fileService'
import { validateName } from '../services/validators'
import Avatar from '../components/Avatar'
import FormField from '../components/FormField'

export default function EditProfilePage() {
  const { user, updateProfile } = useAuth()
  const navigate = useNavigate()
  const fileInput = useRef(null)

  const [name, setName] = useState(user.name)
  const [level, setLevel] = useState(user.level)
  const [bio, setBio] = useState(user.bio || '')
  const [avatar, setAvatar] = useState(user.avatar)
  const [avatarError, setAvatarError] = useState('')
  const [nameError, setNameError] = useState('')
  const [serverError, setServerError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleFileChange(e) {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return

    if (!isValidProfileImage(file)) {
      setAvatarError('Formato no permitido, usa JPG o PNG')
      return // no se actualiza la foto
    }

    try {
      const dataUrl = await resizeImageToDataUrl(file)
      setAvatar(dataUrl)
      setAvatarError('')
    } catch (err) {
      setAvatarError(err.message)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')

    const error = validateName(name)
    setNameError(error)
    if (error) return

    setSaving(true)
    try {
      await updateProfile({ name, level, bio, avatar })
      navigate('/perfil', { state: { message: 'Perfil actualizado correctamente' } })
    } catch (err) {
      setServerError(err.message)
      setSaving(false)
    }
  }

  return (
    <div>
      <h1>Editar perfil</h1>

      <form className="card" onSubmit={handleSubmit} noValidate>
        <div className="avatar-edit">
          <Avatar src={avatar} size={96} />
          <div>
            <input
              ref={fileInput}
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              onChange={handleFileChange}
              hidden
            />
            <button type="button" className="btn btn-secondary btn-small" onClick={() => fileInput.current.click()} disabled={saving}>
              Cambiar foto
            </button>
            {avatarError && <p className="field-error" role="alert">{avatarError}</p>}
          </div>
        </div>

        <FormField label="Nombre" htmlFor="name" error={nameError}>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={saving} />
        </FormField>

        <FormField label="Nivel de experiencia" htmlFor="level">
          <select id="level" value={level} onChange={(e) => setLevel(e.target.value)} disabled={saving}>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Biografía" htmlFor="bio">
          <textarea id="bio" rows="4" maxLength={160} value={bio} onChange={(e) => setBio(e.target.value)} disabled={saving} />
          <span className="small">{bio.length}/160</span>
        </FormField>

        {serverError && <p className="alert" role="alert">{serverError}</p>}

        <div className="form-actions">
          <Link to="/perfil" className="btn btn-secondary">
            Cancelar
          </Link>
          <button className="btn" type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  )
}
