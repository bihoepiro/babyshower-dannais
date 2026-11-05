/**
 * Navegación por "paradas": puntos marcados en el DOM con [data-parada].
 * Cada escena coloca paradas en los momentos clave de su animación;
 * el teclado y los botones saltan de una a otra con un scroll suave.
 */

export interface Parada {
  el: HTMLElement
  id: string
  top: number
  ronda?: string
  fase?: string
}

const TOLERANCIA = 6
let animacion: { destino: number; frame: number } | null = null

export function listarParadas(): Parada[] {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-parada]'))
    .map((el) => ({
      el,
      id: el.dataset.parada!,
      top: Math.round(el.getBoundingClientRect().top + window.scrollY),
      ronda: el.dataset.ronda,
      fase: el.dataset.fase,
    }))
    .sort((a, b) => a.top - b.top)
}

/** Posición de referencia: si hay un scroll en curso, se usa su destino. */
function posicionBase() {
  return animacion ? animacion.destino : window.scrollY
}

export function paradaActual(): Parada | undefined {
  const y = posicionBase()
  return listarParadas().find((p) => Math.abs(p.top - y) <= TOLERANCIA)
}

const suavizar = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function detener() {
  if (animacion) cancelAnimationFrame(animacion.frame)
  animacion = null
}

for (const evento of ['wheel', 'touchstart'] as const) {
  window.addEventListener(evento, detener, { passive: true })
}

export function desplazarA(destino: number) {
  detener()
  const maximo = document.documentElement.scrollHeight - window.innerHeight
  const final = Math.max(0, Math.min(destino, maximo))
  const inicio = window.scrollY
  const distancia = final - inicio
  if (Math.abs(distancia) < 2) return
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const duracion = reducido ? 1 : Math.min(1600, 650 + Math.abs(distancia) * 0.25)
  const t0 = performance.now()
  const paso = (ahora: number) => {
    const t = Math.min(1, (ahora - t0) / duracion)
    window.scrollTo(0, inicio + distancia * suavizar(t))
    if (t < 1 && animacion) animacion.frame = requestAnimationFrame(paso)
    else animacion = null
  }
  animacion = { destino: final, frame: requestAnimationFrame(paso) }
}

export function siguienteParada() {
  const y = posicionBase()
  const p = listarParadas().find((p) => p.top > y + TOLERANCIA)
  if (p) desplazarA(p.top)
}

export function paradaAnterior() {
  const y = posicionBase()
  const p = listarParadas()
    .reverse()
    .find((p) => p.top < y - TOLERANCIA)
  desplazarA(p ? p.top : 0)
}

export function irAParada(id: string) {
  const p = listarParadas().find((p) => p.id === id)
  if (p) desplazarA(p.top)
}
