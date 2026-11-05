import { useRef, type ReactNode } from 'react'
import { useScroll, type MotionValue } from 'framer-motion'

export interface ParadaEscena {
  id: string
  /** Progreso de la escena (0–1) en el que se detiene la navegación por teclado. */
  p: number
  ronda?: string
  fase?: string
}

/**
 * Escena de scrollytelling: una sección alta con un escenario "sticky".
 * Mientras se hace scroll a través de ella, `progreso` va de 0 a 1 y las
 * animaciones de la escena se derivan de ese valor.
 */
export function Escena({
  id,
  alto,
  paradas,
  className = '',
  children,
}: {
  id: string
  /** Alto total de la sección en vh (mínimo 100). */
  alto: number
  paradas: ParadaEscena[]
  className?: string
  children: (progreso: MotionValue<number>) => ReactNode
}) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  return (
    <section ref={ref} id={id} className={`escena ${className}`} style={{ height: `${alto}vh` }}>
      {paradas.map((p) => (
        <span
          key={p.id}
          className="parada"
          data-parada={p.id}
          data-ronda={p.ronda}
          data-fase={p.fase}
          style={{ top: `calc(${p.p} * (100% - 100vh))` }}
          aria-hidden="true"
        />
      ))}
      <div className="escena__escenario">{children(scrollYProgress)}</div>
    </section>
  )
}
