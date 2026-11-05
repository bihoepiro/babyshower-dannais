import { useEffect, useState, type FormEvent } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import type { Bebe } from '../../data/bebes'
import { useJuego, type Resultado } from '../../game/JuegoContext'
import { irAParada } from '../../hooks/navegacion'
import { Celebracion } from '../Celebracion'
import { Escena } from '../Escena'
import { Estrella, Nube } from '../illustrations/Decoraciones'
import { Polaroid } from '../Polaroid'

/** Progreso (0–1) en el que la foto queda revelada y aparece la pregunta. */
const UMBRAL_PREGUNTA = 0.56
const suave = [0.22, 1, 0.36, 1] as const

export function Ronda({ bebe, indice, total, siguiente }: { bebe: Bebe; indice: number; total: number; siguiente: string }) {
  return (
    <Escena
      id={`ronda-${bebe.id}`}
      alto={300}
      className={`escena--papel ronda-escena ${indice % 2 ? 'ronda-escena--par' : ''}`}
      paradas={[
        { id: `ronda-${bebe.id}`, p: 0, ronda: bebe.id, fase: 'inicio' },
        { id: `ronda-${bebe.id}-revelando`, p: 0.3, ronda: bebe.id, fase: 'revelando' },
        { id: `ronda-${bebe.id}-pregunta`, p: 0.64, ronda: bebe.id, fase: 'pregunta' },
      ]}
    >
      {(p) => <Escenario p={p} bebe={bebe} indice={indice} total={total} siguiente={siguiente} />}
    </Escena>
  )
}

function Escenario({
  p,
  bebe,
  indice,
  total,
  siguiente,
}: {
  p: MotionValue<number>
  bebe: Bebe
  indice: number
  total: number
  siguiente: string
}) {
  const { resultados } = useJuego()
  const resultado = resultados[bebe.id]
  const [preguntaVisible, setPreguntaVisible] = useState(() => p.get() >= UMBRAL_PREGUNTA)
  useMotionValueEvent(p, 'change', (v) => setPreguntaVisible(v >= UMBRAL_PREGUNTA))

  // Si la ronda ya se resolvió, la foto se queda revelada aunque se vuelva a subir.
  const forzado = useMotionValue(resultado ? 1 : 0)
  useEffect(() => forzado.set(resultado ? 1 : 0), [resultado, forzado])
  const revelado = useTransform([p, forzado], ([v, f]: number[]) =>
    f ? 1 : Math.min(1, Math.max(0, (v - 0.04) / (UMBRAL_PREGUNTA - 0.1))),
  )

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

  const fase = resultado ? 'resultado' : preguntaVisible ? 'pregunta' : 'revelando'
  const giro = indice % 2 ? 2.2 : -2.4

  return (
    <div className={`ronda ronda--${fase}`}>
      <div className="marco-pagina" aria-hidden="true" />
      <Estrella className="titilar ronda__adorno ronda__adorno--1" />
      <Estrella className="titilar titilar--2 ronda__adorno ronda__adorno--2" color="#b9cdea" />

      <div className="ronda__foto-columna">
        <Polaroid
          giro={giro}
          className="ronda__polaroid"
          pie={
            <AnimatePresence mode="wait" initial={false}>
              {resultado ? (
                <motion.span
                  key="nombre"
                  className="manuscrita ronda__pie-nombre"
                  initial={{ clipPath: 'inset(0 100% 0 0)' }}
                  animate={{ clipPath: 'inset(0 0% 0 0)' }}
                  transition={{ duration: 1.4, ease: 'easeInOut', delay: 0.3 }}
                >
                  {bebe.nombre}
                </motion.span>
              ) : (
                <motion.span key="numero" className="manuscrita ronda__pie-numero" exit={{ opacity: 0 }}>
                  ¿Quién soy?
                </motion.span>
              )}
            </AnimatePresence>
          }
        >
          <motion.img
            src={bebe.foto}
            alt={resultado ? `${bebe.nombre} de bebé` : `Bebé misterioso número ${indice + 1}`}
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
        {resultado && <Celebracion key={`${bebe.id}-${resultado.correcta}`} tipo={resultado.correcta ? 'acierto' : 'casi'} />}
      </div>

      <div className="ronda__panel">
        <p className="ronda__encabezado versalitas">
          Bebé {indice + 1} de {total}
        </p>

        <AnimatePresence mode="wait">
          {fase === 'revelando' && (
            <motion.div
              key="revelando"
              className="ronda__bloque"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.7, ease: suave }}
            >
              <h2 className="manuscrita ronda__titulo">Observen bien…</h2>
              <p className="ronda__texto">
                Esta foto se está revelando poco a poco, como las fotos de antes. Sigan bajando para descubrir esta
                carita.
              </p>
              <div className="revelando" aria-hidden="true">
                <span>Revelando</span>
                <span className="revelando__barra">
                  <motion.span style={{ width: barra }} />
                </span>
                <motion.span>{porcentaje}</motion.span>
              </div>
            </motion.div>
          )}

          {fase === 'pregunta' && (
            <motion.div
              key="pregunta"
              className="ronda__bloque"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.7, ease: suave }}
            >
              <h2 className="ronda__pregunta">¿Quién crees que es este bebé?</h2>
              <Formulario bebe={bebe} />
            </motion.div>
          )}

          {fase === 'resultado' && resultado && (
            <motion.div
              key="resultado"
              className="ronda__bloque"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.8, ease: suave }}
            >
              <Revelacion bebe={bebe} resultado={resultado} ultima={indice === total - 1} siguiente={siguiente} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function Formulario({ bebe }: { bebe: Bebe }) {
  const { responder, revelar } = useJuego()
  const [texto, setTexto] = useState('')

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    if (texto.trim()) responder(bebe.id, texto)
  }

  return (
    <>
      <form className="respuesta" onSubmit={enviar}>
        <label htmlFor={`respuesta-${bebe.id}`} className="solo-lectores">
          Nombre de la persona
        </label>
        <input
          id={`respuesta-${bebe.id}`}
          data-respuesta={bebe.id}
          className="respuesta__campo"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escriban un nombre…"
          autoComplete="off"
          spellCheck={false}
        />
        <button type="submit" className="boton boton--principal" disabled={!texto.trim()}>
          Descubrir
        </button>
      </form>
      <button className="enlace" onClick={() => revelar(bebe.id)}>
        Revelar sin adivinar
      </button>
    </>
  )
}

function Revelacion({
  bebe,
  resultado,
  ultima,
  siguiente,
}: {
  bebe: Bebe
  resultado: Resultado
  ultima: boolean
  siguiente: string
}) {
  const { alternar, deshacer } = useJuego()
  const titulo = resultado.correcta ? '¡Le atinaste! 🎉' : resultado.adivinada ? '¡Casi!' : '¡Sorpresa!'

  return (
    <div className="revelacion" aria-live="polite">
      <p className={`revelacion__veredicto ${resultado.correcta ? 'revelacion__veredicto--acierto' : ''}`}>{titulo}</p>
      <p className="revelacion__frase">Este pequeño bebé era</p>
      <motion.p
        className="manuscrita revelacion__nombre"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.35, ease: suave }}
      >
        {bebe.nombre}
      </motion.p>
      {resultado.adivinada && !resultado.correcta && resultado.respuesta && (
        <p className="revelacion__respuesta">Ustedes dijeron: «{resultado.respuesta}»</p>
      )}
      <button className="boton boton--principal" onClick={() => irAParada(siguiente)}>
        {ultima ? 'Ver el final' : 'Siguiente bebé'}
        <svg viewBox="0 0 24 24" aria-hidden="true" className="boton__flecha">
          <path d="M5 12h13M13 6l6 6-6 6" />
        </svg>
      </button>
      <p className="revelacion__ajustes">
        <button className="enlace" onClick={() => alternar(bebe.id)}>
          {resultado.correcta ? 'Contar como fallo' : 'Contar como acierto'}
        </button>
        <span aria-hidden="true">·</span>
        <button className="enlace" onClick={() => deshacer(bebe.id)}>
          Volver a intentar
        </button>
      </p>
    </div>
  )
}
