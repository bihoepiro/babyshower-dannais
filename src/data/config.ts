/**
 * ─────────────────────────────────────────────────────────────
 *  CONFIGURACIÓN DEL JUEGO · Baby Shower de Dannais 🍼
 * ─────────────────────────────────────────────────────────────
 *  Las fotos se detectan solas desde la carpeta `fotos/`.
 *  El nombre de cada archivo es el nombre de la persona:
 *    fotos/Clau.jpg  →  "Clau"
 *
 *  Este archivo solo sirve para ajustar detalles opcionales.
 */

/** Datos del evento. `null` = no se muestra (valores provisionales). */
export const EVENTO = {
  mama: 'Dannais',
  bebe: 'Noah',
  /** PROVISIONAL: por ejemplo 'Sábado 15 de noviembre · 3:00 p. m.' */
  fecha: null as string | null,
  /** PROVISIONAL: por ejemplo 'Oficina · Sala de reuniones' */
  lugar: null as string | null,
}

/**
 * Orden de las rondas (nombres de archivo sin extensión).
 * Las fotos nuevas que no estén en esta lista se agregan al final,
 * así las rondas existentes nunca cambian de lugar.
 */
export const ORDEN: string[] = [
  'Rodri', 'Clau', 'Victor', 'Jacky', 'Jose', 'Vale', 'Adrian', 'Biho', 'Jime',
  'Vane', 'Mauricio', 'David', 'Dani',
]

/**
 * Foto de la mamá (nombre de archivo sin extensión). No es una ronda del juego:
 * se revela al final como sorpresa especial. Si no existe, esa escena no aparece.
 */
export const FOTO_MAMA = 'Dannais'

// Los apodos y variantes válidas de cada nombre están en ./personas.ts

/** Fotos que existen en la carpeta pero no deben aparecer en el juego. */
export const EXCLUIR: string[] = []
