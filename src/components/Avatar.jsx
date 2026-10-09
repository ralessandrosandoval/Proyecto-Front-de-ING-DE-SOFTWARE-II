import defaultAvatar from '../assets/images/default-avatar.svg'

export default function Avatar({ src, size = 40, alt = 'Avatar' }) {
  return (
    <img
      className="avatar"
      src={src || defaultAvatar}
      alt={alt}
      width={size}
      height={size}
      style={{ width: size, height: size }}
    />
  )
}
