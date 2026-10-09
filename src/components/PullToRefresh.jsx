import { useRef, useState } from 'react'

const THRESHOLD = 50 // cuanto hay que deslizar (ya con resistencia) para refrescar

// Deslizar hacia abajo para actualizar. Funciona con el dedo (celular) y con el mouse (arrastrando).
export default function PullToRefresh({ onRefresh, refreshing, children }) {
  const [pull, setPull] = useState(0)
  const startY = useRef(null)

  function start(y) {
    if (window.scrollY <= 0 && !refreshing) startY.current = y
  }

  function move(y) {
    if (startY.current === null) return
    const distance = y - startY.current
    setPull(distance > 0 ? Math.min(distance * 0.5, 100) : 0)
  }

  function end() {
    if (startY.current === null) return
    startY.current = null
    if (pull >= THRESHOLD) onRefresh()
    setPull(0)
  }

  const height = refreshing ? THRESHOLD : pull
  let text = 'Desliza hacia abajo para actualizar'
  if (refreshing) text = 'Actualizando...'
  else if (pull >= THRESHOLD) text = 'Suelta para actualizar'

  return (
    <div
      onTouchStart={(e) => start(e.touches[0].clientY)}
      onTouchMove={(e) => move(e.touches[0].clientY)}
      onTouchEnd={end}
      onMouseDown={(e) => start(e.clientY)}
      onMouseMove={(e) => move(e.clientY)}
      onMouseUp={end}
      onMouseLeave={end}
    >
      <div className={`ptr-indicator ${pull === 0 ? 'ptr-animated' : ''}`} style={{ height }}>
        {height > 15 && <span className="small">{text}</span>}
      </div>
      {children}
    </div>
  )
}
