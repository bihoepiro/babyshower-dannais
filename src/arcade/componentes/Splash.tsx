import { motion } from 'framer-motion'
import type { Pregunta } from '../preguntas'
import { BEBE, CORONA, INGENIERO, Sprite } from '../sprites'
import { pasos, relleno } from './Comunes'

const NOMBRES = { data: 'DATA ENGINEER', baby: 'BABY ENGINEER', bonus: 'BONUS STAGE' }

/** Cortinilla entre preguntas: número de ronda, equipo y "READY?". */
export function Splash({ pregunta, ronda, onListo }: { pregunta: Pregunta; ronda: number; onListo: () => void }) {
  const bonus = pregunta.equipo === 'bonus'
  return (
    <motion.div
      className={`splash splash--${pregunta.equipo}`}
      onClick={onListo}
      initial={{ clipPath: 'inset(50% 0 50% 0)' }}
      animate={{ clipPath: 'inset(0% 0 0% 0)' }}
      exit={{ clipPath: 'inset(50% 0 50% 0)' }}
      transition={{ duration: 0.35, ease: pasos(5) }}
    >
      <div className="splash__rayas" aria-hidden="true" />
      <motion.p
        className="splash__ronda"
        initial={{ x: '-60vw' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: pasos(6) }}
      >
        {bonus ? '★ PREGUNTA ESPECIAL ★' : `ROUND ${relleno(ronda, 2)}`}
      </motion.p>

      <motion.div
        className="splash__personaje"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.3, ease: pasos(4) }}
      >
        {bonus && <Sprite sprite={CORONA} className="splash__corona" />}
        <Sprite
          sprite={pregunta.equipo === 'data' ? INGENIERO : BEBE}
          paleta={bonus ? { h: '#35c6ff', H: '#2c5cf6' } : undefined}
          className="saltito"
        />
      </motion.div>

      <motion.h2
        className="splash__equipo"
        initial={{ x: '60vw' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4, delay: 0.25, ease: pasos(6) }}
      >
        {NOMBRES[pregunta.equipo]}
      </motion.h2>
      {bonus && <p className="splash__extra parpadeo">PUNTOS x3</p>}
      <p className="splash__listo parpadeo">{bonus ? '¿LISTOS?' : 'READY?'}</p>
    </motion.div>
  )
}
