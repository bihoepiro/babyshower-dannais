import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LETRAS, PREGUNTAS, PUNTOS, type Letra } from './preguntas'
import { sonido } from './sonido'
import { Crt, Fondo } from './componentes/Fondo'
import { Hud, pasos } from './componentes/Comunes'
import { Inicio } from './componentes/Inicio'
import { Splash } from './componentes/Splash'
import { PantallaPregunta } from './componentes/PantallaPregunta'
import { Final } from './componentes/Final'

type Fase = 'inicio' | 'splash' | 'pregunta' | 'final'

/** Pausa dramática entre elegir y revelar. */
const SUSPENSO_MS = 1100
const SPLASH_MS = { normal: 1700, bonus: 2800 }

function leerRecord() {
  try {
    return Number(localStorage.getItem('arcade-record')) || 0
  } catch {
    return 0
  }
}

export function calcularPuntaje(respuestas: (Letra | null)[]) {
  return PREGUNTAS.reduce(
    (total, p, i) => total + (respuestas[i] === p.correcta ? (p.equipo === 'bonus' ? PUNTOS.bonus : PUNTOS.normal) : 0),
    0,
  )
}

function alternarPantallaCompleta() {
  if (document.fullscreenElement) void document.exitFullscreen?.()
  else void document.documentElement.requestFullscreen?.().catch(() => {})
}

export default function App() {
  const [fase, setFase] = useState<Fase>('inicio')
  const [indice, setIndice] = useState(0)
  const [respuestas, setRespuestas] = useState<(Letra | null)[]>([])
  const [elegida, setElegida] = useState<Letra | null>(null)
  const [revelada, setRevelada] = useState(false)
  const [record, setRecord] = useState(leerRecord)
  const [nuevoRecord, setNuevoRecord] = useState(false)
  const [musica, setMusica] = useState(sonido.musicaActiva)
  const [silencio, setSilencio] = useState(sonido.silenciado)
  const temporizador = useRef<number>(undefined)

  const pregunta = PREGUNTAS[indice]
  const puntaje = calcularPuntaje(respuestas)

  const mostrarPregunta = useCallback((i: number) => {
    window.clearTimeout(temporizador.current)
    setIndice(i)
    setElegida(null)
    setRevelada(false)
    setFase('splash')
    if (PREGUNTAS[i].equipo === 'bonus') sonido.bonus()
    temporizador.current = window.setTimeout(
      () => setFase('pregunta'),
      PREGUNTAS[i].equipo === 'bonus' ? SPLASH_MS.bonus : SPLASH_MS.normal,
    )
  }, [])

  const empezar = useCallback(() => {
    sonido.despertar()
    sonido.inicio()
    sonido.iniciarMusica()
    setRespuestas([])
    setNuevoRecord(false)
    mostrarPregunta(0)
  }, [mostrarPregunta])

  const saltarSplash = useCallback(() => {
    window.clearTimeout(temporizador.current)
    setFase('pregunta')
  }, [])

  const elegir = useCallback(
    (letra: Letra) => {
      if (fase !== 'pregunta' || elegida) return
      setElegida(letra)
      sonido.seleccionar()
      sonido.suspenso()
      temporizador.current = window.setTimeout(() => {
        setRevelada(true)
        setRespuestas((r) => {
          const copia = [...r]
          copia[indice] = letra
          return copia
        })
        if (letra === PREGUNTAS[indice].correcta) sonido.acierto()
        else sonido.error()
      }, SUSPENSO_MS)
    },
    [fase, elegida, indice],
  )

  const siguiente = useCallback(() => {
    if (!revelada) return
    if (indice < PREGUNTAS.length - 1) {
      sonido.moneda()
      mostrarPregunta(indice + 1)
      return
    }
    const final = calcularPuntaje(respuestas)
    if (final > record) {
      setRecord(final)
      setNuevoRecord(true)
      try {
        localStorage.setItem('arcade-record', String(final))
      } catch {
        /* sin almacenamiento */
      }
    }
    sonido.victoria()
    setFase('final')
  }, [revelada, indice, respuestas, record, mostrarPregunta])

  const alMenu = useCallback(() => {
    window.clearTimeout(temporizador.current)
    setFase('inicio')
  }, [])

  useEffect(() => {
    const alPresionar = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return
      const tecla = e.key.toUpperCase()
      if (tecla === 'M') {
        sonido.despertar()
        setMusica(sonido.alternarMusica())
        return
      }
      if (tecla === 'S') {
        setSilencio(sonido.alternarSilencio())
        return
      }
      if (tecla === 'F') {
        alternarPantallaCompleta()
        return
      }
      const avanzar = e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight'
      if (avanzar) e.preventDefault()

      if (fase === 'inicio' && avanzar) empezar()
      else if (fase === 'splash' && avanzar) saltarSplash()
      else if (fase === 'pregunta') {
        const porNumero = { '1': 'A', '2': 'B', '3': 'C' } as Record<string, Letra>
        const letra = LETRAS.includes(tecla as Letra) ? (tecla as Letra) : porNumero[e.key]
        if (letra) elegir(letra)
        else if (avanzar) siguiente()
      } else if (fase === 'final' && (avanzar || tecla === 'R')) empezar()
    }
    window.addEventListener('keydown', alPresionar)
    return () => window.removeEventListener('keydown', alPresionar)
  }, [fase, empezar, saltarSplash, elegir, siguiente])

  useEffect(() => () => window.clearTimeout(temporizador.current), [])

  const tono = fase === 'inicio' ? 'inicio' : fase === 'final' ? 'final' : pregunta.equipo

  return (
    <div className="arcade">
      <Fondo tono={tono} />
      <div className="pantalla">
        {fase !== 'inicio' && (
          <Hud
            puntaje={puntaje}
            record={record}
            indice={indice}
            respuestas={respuestas}
            musica={musica}
            silencio={silencio}
            onMusica={() => {
              sonido.despertar()
              setMusica(sonido.alternarMusica())
            }}
            onSilencio={() => setSilencio(sonido.alternarSilencio())}
            onPantalla={alternarPantallaCompleta}
          />
        )}

        <AnimatePresence mode="wait">
          <motion.main
            key={fase === 'pregunta' || fase === 'splash' ? `p-${indice}` : fase}
            className="escenario"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: pasos(3) }}
          >
            {fase === 'inicio' && <Inicio record={record} onStart={empezar} />}
            {(fase === 'pregunta' || fase === 'splash') && (
              <PantallaPregunta
                pregunta={pregunta}
                indice={indice}
                elegida={elegida}
                revelada={revelada}
                onElegir={elegir}
                onSiguiente={siguiente}
              />
            )}
            {fase === 'final' && (
              <Final
                puntaje={puntaje}
                respuestas={respuestas}
                nuevoRecord={nuevoRecord}
                onReiniciar={empezar}
                onMenu={alMenu}
              />
            )}
          </motion.main>
        </AnimatePresence>

        <AnimatePresence>
          {fase === 'splash' && <Splash key={indice} pregunta={pregunta} ronda={indice + 1} onListo={saltarSplash} />}
        </AnimatePresence>
      </div>
      <Crt />
    </div>
  )
}
