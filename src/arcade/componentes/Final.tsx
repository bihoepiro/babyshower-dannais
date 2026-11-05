import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PREGUNTAS, PUNTAJE_MAXIMO, type Letra } from '../preguntas'
import { BEBE, BIBERON, COPO, CORAZON, CORONA, Sprite } from '../sprites'
import { Explosion, pasos, relleno } from './Comunes'

/** Rango según aciertos (de 15). */
function rango(aciertos: number) {
  if (aciertos === PREGUNTAS.length) return 'LEYENDA DE LOS PAÑALES Y LOS PIPELINES'
  if (aciertos >= 12) return 'SENIOR BABY-DATA ENGINEER'
  if (aciertos >= 8) return 'MID-LEVEL CAMBIAPAÑALES'
  if (aciertos >= 4) return 'JUNIOR EN PRÁCTICAS DE BIBERÓN'
  return 'BEBÉ EN ONBOARDING'
}

function useContador(destino: number, duracion = 1800) {
  const [valor, setValor] = useState(0)
  useEffect(() => {
    const t0 = performance.now()
    let frame = 0
    const paso = (ahora: number) => {
      const t = Math.min(1, (ahora - t0) / duracion)
      setValor(Math.round(destino * t))
      if (t < 1) frame = requestAnimationFrame(paso)
    }
    frame = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(frame)
  }, [destino, duracion])
  return valor
}

export function Final({
  puntaje,
  respuestas,
  nuevoRecord,
  onReiniciar,
  onMenu,
}: {
  puntaje: number
  respuestas: (Letra | null)[]
  nuevoRecord: boolean
  onReiniciar: () => void
  onMenu: () => void
}) {
  const contador = useContador(puntaje)
  const acierta = (equipo: string) =>
    PREGUNTAS.filter((p, i) => p.equipo === equipo && respuestas[i] === p.correcta).length
  const total = (equipo: string) => PREGUNTAS.filter((p) => p.equipo === equipo).length
  const aciertos = PREGUNTAS.filter((p, i) => respuestas[i] === p.correcta).length
  const bonus = PREGUNTAS.find((p) => p.equipo === 'bonus')!

  return (
    <div className="final-arcade">
      <Explosion cantidad={70} />

      <motion.h2
        className="final-arcade__titulo"
        initial={{ scale: 3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: pasos(5) }}
      >
        GAME CLEAR!
      </motion.h2>

      <div className="final-arcade__cuerpo">
        <motion.section
          className="tarjeta-pixel marcador-final"
          initial={{ x: '-50vw' }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: pasos(6) }}
        >
          <p className="marcador-final__rotulo">SCORE FINAL</p>
          <p className="marcador-final__puntaje">{relleno(contador)}</p>
          <p className="marcador-final__maximo">de {relleno(PUNTAJE_MAXIMO)} posibles</p>
          {nuevoRecord && <p className="marcador-final__record parpadeo">★ NEW HI-SCORE ★</p>}
          <ul className="marcador-final__detalle">
            <li>
              <span>DATA ENGINEER</span>
              <span>
                {acierta('data')}/{total('data')}
              </span>
            </li>
            <li>
              <span>BABY ENGINEER</span>
              <span>
                {acierta('baby')}/{total('baby')}
              </span>
            </li>
            <li>
              <span>BONUS PADRINO</span>
              <span>{acierta('bonus') ? '✓' : '✗'}</span>
            </li>
          </ul>
          <p className="marcador-final__rango-rotulo">RANGO DEL EQUIPO</p>
          <p className="marcador-final__rango">{rango(aciertos)}</p>
        </motion.section>

        <motion.section
          className="noah"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6, ease: pasos(5) }}
        >
          <p className="noah__aviso parpadeo">PLAYER 3 HAS JOINED THE GAME!</p>
          <div className="noah__escena">
            <Sprite sprite={CORAZON} className="noah__corazon noah__corazon--1 flotar" />
            <Sprite sprite={CORAZON} className="noah__corazon noah__corazon--2 flotar flotar--lento" />
            <Sprite sprite={BIBERON} className="noah__objeto noah__objeto--1 flotar" />
            <Sprite sprite={COPO} className="noah__objeto noah__objeto--2 flotar flotar--lento" />
            <Sprite sprite={CORONA} className="noah__corona festejo" />
            <Sprite sprite={BEBE} paleta={{ h: '#35c6ff', H: '#2c5cf6' }} className="noah__bebe festejo" titulo="Noah" />
            <div className="plataforma plataforma--bonus" />
          </div>
          <p className="noah__nombre">¡BIENVENIDO, NOAH!</p>
        </motion.section>

        <motion.section
          className="tarjeta-pixel padrino"
          initial={{ x: '50vw' }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, delay: 0.9, ease: pasos(6) }}
        >
          <p className="padrino__rotulo">★ BONUS DESBLOQUEADO ★</p>
          <p className="padrino__titulo">PADRINO BELCORP</p>
          <p className="padrino__nombre">{bonus.opciones[bonus.correcta]}</p>
          <p className="padrino__texto">{bonus.explicacion}</p>
        </motion.section>
      </div>

      <motion.div
        className="final-arcade__pie"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, ease: pasos(3) }}
      >
        <p className="globo-pixel final-arcade__mensaje">
          Noah ya tiene el mejor equipo esperándolo: expertos en pipelines… y, desde hoy, también en pañales. 🍼❄️
        </p>
        <div className="final-arcade__botones">
          <button className="boton-arcade boton-arcade--chico" onClick={onReiniciar} autoFocus>
            PLAY AGAIN
          </button>
          <button className="boton-arcade boton-arcade--chico boton-arcade--secundario" onClick={onMenu}>
            MENÚ
          </button>
        </div>
      </motion.div>
    </div>
  )
}
