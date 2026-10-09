import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

// Estructura comun de las paginas privadas: barra de navegacion + contenido
export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
    </>
  )
}
