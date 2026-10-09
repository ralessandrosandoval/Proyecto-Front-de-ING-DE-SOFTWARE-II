# Lift Up - Frontend (Release 01)

Frontend en React (Vite) del MVP de Lift Up. No usa backend: los datos se guardan en `localStorage`
(usuarios, publicaciones, sesión) e `IndexedDB` (fotos y videos).

## Cómo ejecutarlo

```bash
npm install
npm run dev
```

Abrir la dirección que muestra la terminal (normalmente http://localhost:5173).

## Usuarios de ejemplo

Contraseña de todos: `password123`

- ana@liftup.com
- carlos@liftup.com
- lucia@liftup.com

También se puede crear una cuenta nueva desde "Regístrate".

## Estructura

```
src/
  assets/       imágenes y estilos
  components/   piezas reutilizables (Navbar, PostCard, Modal, etc.)
  context/      estado global (sesión y publicaciones)
  data/         datos de ejemplo y listas fijas
  pages/        una por cada pantalla
  services/     lógica que simula el backend (localStorage / IndexedDB)
```

## Historias de usuario del Release 01

| HU | Qué hace | Dónde está |
|----|----------|------------|
| HU-001 | Registro con correo y contraseña | `pages/RegisterPage.jsx` |
| HU-002 | Inicio de sesión y sesión persistente | `pages/LoginPage.jsx`, `context/AuthContext.jsx` |
| HU-003 | Cerrar sesión con confirmación | `pages/ProfilePage.jsx`, `components/ProfileMenu.jsx` |
| HU-004 | Editar perfil (foto, nombre, nivel, biografía) | `pages/EditProfilePage.jsx` |
| HU-005 | Publicar, editar y eliminar sesiones | `pages/NewPostPage.jsx`, `pages/PostDetailPage.jsx` |
| HU-006 | Feed con refresco, scroll infinito y priorización | `pages/FeedPage.jsx` |

## Pruebas rápidas

- **Error de red en la subida:** en "Nueva sesión" marcar "Simular error de red", publicar y usar "Reintentar".
- **Feed vacío:** en Perfil > "Herramientas de prueba" > "Vaciar publicaciones".
- **Volver a los datos iniciales:** en Perfil > "Herramientas de prueba" > "Restablecer datos de ejemplo".
- **Priorización:** pulsar "Seguir" en una publicación; las de esa persona suben al inicio del feed.
