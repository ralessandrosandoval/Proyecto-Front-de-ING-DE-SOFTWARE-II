// Guarda las fotos/videos de las publicaciones en IndexedDB.
// (localStorage solo permite ~5MB, un video no cabria)

const DB_NAME = 'liftup-media'
const STORE = 'files'

function openDb() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('Tu navegador no permite guardar archivos'))
      return
    }
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(new Error('No se pudo abrir el almacenamiento'))
  })
}

function run(mode, action) {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, mode)
        const request = action(tx.objectStore(STORE))
        tx.oncomplete = () => {
          db.close()
          resolve(request.result)
        }
        tx.onerror = () => reject(new Error('Error al guardar el archivo'))
        tx.onabort = () => reject(new Error('Error al guardar el archivo'))
      })
  )
}

export async function saveMedia(file) {
  const id = 'm_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  await run('readwrite', (store) => store.put(file, id))
  return id
}

export function getMedia(id) {
  return run('readonly', (store) => store.get(id))
}

export function deleteMedia(id) {
  return run('readwrite', (store) => store.delete(id)).catch(() => {})
}

export function clearMedia() {
  return run('readwrite', (store) => store.clear()).catch(() => {})
}
