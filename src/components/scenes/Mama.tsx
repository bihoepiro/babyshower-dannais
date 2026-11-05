import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion'
import type { Bebe } from '../../data/bebes'
import { useAparicion } from '../../hooks/useAparicion'
import { Celebracion } from '../Celebracion'
import { Escena } from '../Escena'
import { Estrella, Globo, Nube } from '../illustrations/Decoraciones'
import { Polaroid } from '../Polaroid'

/** Progreso en el que la foto de mamá queda revelada. */
const UMBRAL = 0.74
const suave = [0.22, 1, 0.36, 1] as const

/** Cierre, pantalla 2: la sorpresa. Cómo era mamá de bebé. */
export function Mama({ mama }: { mama: Bebe }) {
  return (
    <Escena
      id="mama"
      alto={380}
      className="escena--papel"
      paradas={[
        { id: 'mama', p: 0.2 },
        { id: 'mama-revelando', p: 0.55 },
        { id: 'mama-sorpresa', p: 0.84 },
      ]}
    >
      {(p) => <Escenario p={p} mama={mama} />}
    </Escena>
  )
}

function Escenario({ p, mama }: { p: MotionValue<number>; mama: Bebe }) {
  const [revelada, setRevelada] = useState(() => p.get() >= UMBRAL)
  useMotionValueEvent(p, 'change', (v) => setRevelada(v >= UMBRAL))

  // Anuncio de Noah
  const linea1 = useAparicion(p, 0.03, 0.1)
  const linea2 = useAparicion(p, 0.11, 0.19)
  const anuncio = useTransform(p, [0.28, 0.35], [1, 0])
  const anuncioY = useTransform(p, [0.28, 0.35], [0, -40])

  // Revelado de la foto
  const escenario = useTransform(p, [0.33, 0.41], [0, 1])
  const revelado = useTransform(p, [0.42, UMBRAL - 0.02], [0, 1])
  const filtro = useTransform(
    revelado,
    (v) => `blur(${(1 - v) * 26}px) sepia(${0.9 - 0.68 * v}) saturate(${0.55 + 0.4 * v}) contrast(${0.85 + 0.12 * v})`,
  )
  const velo = useTransform(revelado, [0, 0.8], [0.9, 0])
  const nubeIzq = useTransform(revelado, [0, 0.85], ['0%', '-85%'])
  const nubeDer = useTransform(revelado, [0, 0.85], ['0%', '85%'])
  const nubes = useTransform(revelado, [0.45, 0.9], [1, 0])
  const porcentaje = useTransform(revelado, (v) => `${Math.round(v * 100)}%`)
  const barra = useTransform(revelado, (v) => `${v * 100}%`)

  return (
    <div className="mama">
      <div className="marco-pagina" aria-hidden="true" />
      <Estrella className="titilar ronda__adorno ronda__adorno--1" />
      <Estrella className="titilar titilar--2 ronda__adorno ronda__adorno--2" color="#b9cdea" />

      <motion.div className="mama__anuncio" style={{ opacity: anuncio, y: anuncioY }}>
        <Nube className="deriva mama__nube" />
        <div className="flotar mama__globo" aria-hidden="true">
          <Globo cordel={90} />
        </div>
        <motion.p className="mama__linea" style={linea1}>
          ¡Y ahora que ya descubrimos cómo eran mis tíos de oficina cuando eran chiquitos…
        </motion.p>
        <motion.p className="manuscrita mama__linea mama__linea--grande" style={linea2}>
          …vamos a descubrir cómo era mi mamá!
        </motion.p>
      </motion.div>

      <motion.div className="ronda mama__revelado" style={{ opacity: escenario }}>
        <div className="ronda__foto-columna">
          <div className="mama__marco">
            <Polaroid
              giro={-1.5}
              className="ronda__polaroid mama__polaroid"
              pie={
                <AnimatePresence mode="wait" initial={false}>
                  {revelada ? (
                    <motion.span
                      key="nombre"
                      className="manuscrita ronda__pie-nombre"
                      initial={{ clipPath: 'inset(0 100% 0 0)' }}
                      animate={{ clipPath: 'inset(0 0% 0 0)' }}
                      transition={{ duration: 1.4, ease: 'easeInOut', delay: 0.3 }}
                    >
                      Mamá
                    </motion.span>
                  ) : (
                    <motion.span key="pregunta" className="manuscrita ronda__pie-numero" exit={{ opacity: 0 }}>
                      ¿Quién será?
                    </motion.span>
                  )}
                </AnimatePresence>
              }
            >
              <motion.img
                src={mama.foto}
                alt={revelada ? `${mama.nombre} de bebé` : 'Bebé sorpresa'}
                className="ronda__imagen"
                style={{ filter: filtro }}
                draggable={false}
                decoding="async"
              />
              <motion.span className="ronda__velo" style={{ opacity: velo }} aria-hidden="true" />
              <motion.div className="ronda__nubes" style={{ opacity: nubes }} aria-hidden="true">
                <motion.div className="ronda__nube ronda__nube--izq" style={{ x: nubeIzq }}>
                  <Nube />
                </motion.div>
                <motion.div className="ronda__nube ronda__nube--der" style={{ x: nubeDer }}>
                  <Nube />
                </motion.div>
              </motion.div>
            </Polaroid>
            <span className="mama__sello" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 21 C5 15 1 11 1 7 C1 4 3.5 2 6.5 2 C9 2 11 3.5 12 5.5 C13 3.5 15 2 17.5 2 C20.5 2 23 4 23 7 C23 11 19 15 12 21 Z" />
              </svg>
            </span>
          </div>
          {revelada && <Celebracion tipo="acierto" />}
        </div>

        <div className="ronda__panel">
          <p className="ronda__encabezado versalitas">Una sorpresa muy especial</p>
          <AnimatePresence mode="wait">
            {revelada ? (
              <motion.div
                key="revelada"
                className="revelacion"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.8, ease: suave }}
              >
                <p className="revelacion__veredicto revelacion__veredicto--acierto">¡Es mi mamá! 💙</p>
                <p className="revelacion__frase">Esta pequeña bebé era</p>
                <motion.p
                  className="manuscrita revelacion__nombre"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.35, ease: suave }}
                >
                  {mama.nombre}
                </motion.p>
                <p className="ronda__texto">
                  Así de chiquitita era la persona que más me espera en el mundo… ¡y ya se le notaba lo linda!
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="revelando"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.7, ease: suave }}
              >
                <h2 className="manuscrita ronda__titulo">¿Quién será?</h2>
                <p className="ronda__texto">Esta foto la guardé para el final. Miren bien esa carita…</p>
                <div className="revelando" aria-hidden="true">
                  <span>Revelando</span>
                  <span className="revelando__barra">
                    <motion.span style={{ width: barra }} />
                  </span>
                  <motion.span>{porcentaje}</motion.span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
