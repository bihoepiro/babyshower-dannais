import { EXCLUIR, FOTO_MAMA, ORDEN } from './config'
import { PERSONAS, type Persona } from './personas'
import { normalizar } from '../game/coincidencia'

export interface Bebe {
  /** Nombre del archivo sin extensión. Identificador estable. */
  id: string
  /** Nombre que se muestra al revelar. */
  nombre: string
  foto: string
  alias: string[]
}

// Vite detecta cada imagen de la carpeta `fotos/` al compilar y le da una URL con hash.
const archivos = import.meta.glob<string>('../../fotos/*.{jpg,jpeg,png,webp,gif,avif,JPG,JPEG,PNG,WEBP,GIF,AVIF}', {
  eager: true,
  query: '?url',
  import: 'default',
})

function idDesdeRuta(ruta: string) {
  const archivo = ruta.split('/').pop() ?? ruta
  return archivo.replace(/\.[^.]+$/, '')
}

/** Busca la ficha de la persona sin importar tildes ni mayúsculas. */
function persona(id: string): Persona {
  const clave = Object.keys(PERSONAS).find((k) => normalizar(k) === normalizar(id))
  return clave ? PERSONAS[clave] : {}
}

const detectados: Bebe[] = Object.entries(archivos)
  .map(([ruta, url]) => {
    const id = idDesdeRuta(ruta)
    const ficha = persona(id)
    return {
      id,
      nombre: ficha.nombre ?? id.replace(/[_-]+/g, ' ').trim(),
      foto: url,
      alias: ficha.alias ?? [],
    }
  })
  .filter((b) => !EXCLUIR.includes(b.id))

const esMama = (b: Bebe) => normalizar(b.id) === normalizar(FOTO_MAMA)

/** La foto sorpresa de la mamá (fuera de las rondas del juego). */
export const MAMA: Bebe | undefined = detectados.find(esMama)

const posicion = (id: string) => {
  const i = ORDEN.indexOf(id)
  return i === -1 ? Number.POSITIVE_INFINITY : i
}

export const BEBES: Bebe[] = detectados.filter((b) => !esMama(b)).sort(
  (a, b) => posicion(a.id) - posicion(b.id) || a.id.localeCompare(b.id, 'es'),
)
