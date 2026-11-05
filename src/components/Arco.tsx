import { motion, type MotionValue } from 'framer-motion'
import type { ReactNode } from 'react'

/**
 * La composición de la invitación: fondo de rayas celestes y una tarjeta en
 * forma de arco con un filete fino. `escala` y `rayas` permiten "entrar"
 * en la invitación haciendo zoom con el scroll.
 */
export function Arco({
  escala,
  rayas,
  children,
  fondo,
}: {
  escala?: MotionValue<number>
  rayas?: MotionValue<number>
  children: ReactNode
  /** Elementos decorativos sobre las rayas, detrás del arco. */
  fondo?: ReactNode
}) {
  return (
    <div className="arco-escena">
      <motion.div className="rayas" style={{ opacity: rayas }} aria-hidden="true" />
      {fondo}
      <motion.div className="arco" style={{ scale: escala }}>
        <div className="arco__filete" aria-hidden="true" />
        <div className="arco__contenido">{children}</div>
      </motion.div>
    </div>
  )
}
