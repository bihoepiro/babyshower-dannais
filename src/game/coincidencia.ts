import type { Bebe } from '../data/bebes'

/** Minúsculas, sin tildes, sin signos y con espacios simples: "  Víctor! " → "victor". */
export function normalizar(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Clave fonética para nombres en español: dos escrituras que suenan igual
 * dan la misma clave (Ximena = Jimena = Gimena, Jacky = Jaky = Jaqui, Víctor = Bictor).
 */
export function fonetica(palabra: string) {
  return palabra
    .replace(/ch/g, 'C')
    .replace(/ph/g, 'f')
    .replace(/h/g, '')
    .replace(/qu(?=[ei])/g, 'k')
    .replace(/c(?=[ei])/g, 's')
    .replace(/[cq]/g, 'k')
    .replace(/g(?=[ei])/g, 'j')
    .replace(/x/g, 'j')
    .replace(/z/g, 's')
    .replace(/v/g, 'b')
    .replace(/w/g, 'u')
    .replace(/ll/g, 'y')
    .replace(/y(?![aeiou])/g, 'i')
    .replace(/(.)\1+/g, '$1')
}

/** Distancia de edición contando como un solo error el intercambio de dos letras vecinas. */
function distancia(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) d[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const costo = a[i - 1] === b[j - 1] ? 0 : 1
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + costo)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1)
    }
  }
  return d[a.length][b.length]
}

// Qué tan claramente una palabra corresponde a un nombre.
const EXACTO = 3 // igual al nombre o a un alias
const SUENA_IGUAL = 2 // misma pronunciación: Ximena / Jimena
const PARECIDO = 1 // diminutivo, nombre completo o error de tipeo

const esPrefijo = (a: string, b: string) => a.length >= 4 && b.length >= 4 && (a.startsWith(b) || b.startsWith(a))

function compararPalabra(palabra: string, forma: string) {
  if (palabra === forma) return EXACTO
  const p = fonetica(palabra)
  const f = fonetica(forma)
  if (p === f) return SUENA_IGUAL
  // Rodrigo ↔ Rodri, Valeria ↔ Vale, Bihonda ↔ Biho
  if (esPrefijo(palabra, forma) || esPrefijo(p, f)) return PARECIDO
  // Errores de tipeo: 1 en nombres de 5+ letras, 2 en nombres de 8+; en nombres de 4, solo letras intercambiadas.
  const errores = distancia(p, f)
  const tolerancia = f.length >= 8 ? 2 : f.length >= 5 ? 1 : 0
  if (errores <= tolerancia) return PARECIDO
  if (f.length === 4 && errores === 1 && [...p].sort().join('') === [...f].sort().join('')) return PARECIDO
  return 0
}

function formas(bebe: Bebe) {
  return [...new Set([bebe.nombre, bebe.id, ...bebe.alias].map(normalizar).filter(Boolean))]
}

/** 0 = no tiene nada que ver; 3 = coincide exactamente con su nombre o un alias. */
export function puntaje(respuesta: string, bebe: Bebe) {
  const r = normalizar(respuesta)
  if (!r) return 0
  const palabras = r.split(' ')
  let mejor = 0
  for (const forma of formas(bebe)) {
    if (forma.includes(' ')) {
      // Alias de varias palabras ("Maria Jose"): debe aparecer completo.
      if (` ${r} `.includes(` ${forma} `)) return EXACTO
      if (fonetica(r).includes(fonetica(forma))) mejor = Math.max(mejor, SUENA_IGUAL)
    } else {
      for (const palabra of palabras) mejor = Math.max(mejor, compararPalabra(palabra, forma))
    }
  }
  return mejor
}

/**
 * ¿La respuesta del grupo corresponde a este bebé?
 * Debe parecerse a su nombre y NO parecerse igual o más al de otra persona del juego:
 * si alguien escribe el nombre de otro compañero, o algo ambiguo entre dos, no cuenta.
 */
export function esCorrecta(respuesta: string, bebe: Bebe, todos: Bebe[]) {
  const propio = puntaje(respuesta, bebe)
  if (!propio) return false
  return todos.every((otro) => otro.id === bebe.id || puntaje(respuesta, otro) < propio)
}
