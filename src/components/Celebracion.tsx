import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Globo } from './illustrations/Decoraciones'

const COLORES = ['#a9c4e9', '#dcc391', '#f0c3b9', '#c9dbf2', '#e8d6bb']
const FORMAS = {
  estrella: 'M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z',
  corazon: 'M12 21 C5 15 1 11 1 7 C1 4 3.5 2 6.5 2 C9 2 11 3.5 12 5.5 C13 3.5 15 2 17.5 2 C20.5 2 23 4 23 7 C23 11 19 15 12 21 Z',
  punto: 'M12 4 A8 8 0 1 1 11.99 4 Z',
}
const azar = (min: number, max: number) => min + Math.random() * (max - min)

/** Lluvia suave de estrellitas y corazones al revelar un nombre. */
export function Celebracion({ tipo }: { tipo: 'acierto' | 'casi' }) {
  const reducido = useReducedMotion()
  const piezas = useMemo(() => {
    const formas = Object.values(FORMAS)
    return Array.from({ length: tipo === 'acierto' ? 28 : 12 }, (_, i) => ({
      forma: formas[i % formas.length],
      color: COLORES[i % COLORES.length],
      tamano: azar(14, 30),
      x: azar(-320, 320),
      y: azar(-300, -80),
      caida: azar(140, 300),
      giro: azar(-200, 200),
      retraso: azar(0.2, 0.7),
    }))
  }, [tipo])

  if (reducido) return null

  return (
    <div className="celebracion" aria-hidden="true">
      {piezas.map((p, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 24 24"
          className="celebracion__pieza"
          style={{ width: p.tamano, height: p.tamano }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.3, rotate: 0 }}
          animate={{
            x: p.x,
            y: [0, p.y, p.y + p.caida],
            opacity: [0, 1, 1, 0],
            scale: 1,
            rotate: p.giro,
          }}
          transition={{ duration: 3.2, delay: p.retraso, ease: 'easeOut', times: [0, 0.35, 1] }}
        >
          <path d={p.forma} fill={p.color} />
        </motion.svg>
      ))}
      {tipo === 'acierto' &&
        [-1, 0, 1].map((lado) => (
          <motion.div
            key={lado}
            className="celebracion__globo"
            style={{ left: `${50 + lado * 34}%` }}
            initial={{ y: '60vh', opacity: 0 }}
            animate={{ y: '-110vh', opacity: [0, 1, 1, 0], rotate: [lado * 4, -lado * 4, lado * 3] }}
            transition={{ duration: 7 + lado, delay: 0.4 + Math.abs(lado) * 0.5, ease: 'easeOut' }}
          >
            <Globo tono={lado === 0 ? 'celeste' : lado < 0 ? 'palido' : 'crema'} cordel={90} />
          </motion.div>
        ))}
    </div>
  )
}
