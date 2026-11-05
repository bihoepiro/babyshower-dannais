import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { BEBES } from '../data/bebes'
import { useJuego } from '../game/JuegoContext'
import { desplazarA, irAParada, paradaAnterior, siguienteParada } from '../hooks/navegacion'

const INACTIVIDAD_MS = 2800

function alternarPantallaCompleta() {
  if (document.fullscreenElement) document.exitFullscreen?.()
  else document.documentElement.requestFullscreen?.().catch(() => {})
}

/** Ronda cuya escena ocupa el centro de la pantalla. */
function rondaEnPantalla(): string | undefined {
  const centro = window.innerHeight / 2
  return BEBES.find((b) => {
    const r = document.getElementById(`ronda-${b.id}`)?.getBoundingClientRect()
    return r && r.top <= centro && r.bottom >= centro
  })?.id
}

/** Campo de respuesta visible en pantalla (solo existe mientras la pregunta está abierta). */
function campoVisible(): HTMLInputElement | null {
  const campos = document.querySelectorAll<HTMLInputElement>('[data-respuesta]')
  for (const campo of campos) {
    const r = campo.getBoundingClientRect()
    if (r.top >= 0 && r.bottom <= window.innerHeight && r.width > 0) return campo
  }
  return null
}

const Icono = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={d} />
  </svg>
)

export function Presentador() {
  const { resultados, revelar, reiniciar } = useJuego()
  const [ayuda, setAyuda] = useState(false)
  const [aviso, setAviso] = useState<string | null>(null)
  const [actual, setActual] = useState<string | undefined>()
  const [pantallaCompleta, setPantallaCompleta] = useState(false)
  const [activo, setActivo] = useState(true)
  const [confirmar, setConfirmar] = useState(false)
  const temporizador = useRef<number>(undefined)

  const avisar = useCallback((texto: string) => {
    setAviso(texto)
    window.clearTimeout(temporizador.current)
    temporizador.current = window.setTimeout(() => setAviso(null), 3200)
  }, [])

  const avanzar = useCallback(() => {
    const campo = campoVisible()
    if (campo) {
      // No se salta una pregunta abierta por accidente.
      campo.focus()
      avisar('Escriban un nombre y presionen Enter, o usen «Revelar sin adivinar».')
      return
    }
    siguienteParada()
  }, [avisar])

  const revelarActual = useCallback(() => {
    const id = rondaEnPantalla()
    if (id) revelar(id)
  }, [revelar])

  const hacerReinicio = useCallback(() => {
    reiniciar()
    setConfirmar(false)
    irAParada('juego')
  }, [reiniciar])

  // Teclado
  useEffect(() => {
    const alPresionar = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const destino = e.target as HTMLElement
      const escribiendo = destino.tagName === 'INPUT' || destino.tagName === 'TEXTAREA' || destino.isContentEditable
      if (escribiendo) {
        if (e.key === 'Escape') destino.blur()
        return
      }
      if (destino.tagName === 'BUTTON' && e.key === 'Enter') return

      switch (e.key) {
        case ' ':
          e.preventDefault()
          ;(document.activeElement as HTMLElement | null)?.blur?.()
          if (e.shiftKey) paradaAnterior()
          else avanzar()
          return
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault()
          avanzar()
          return
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault()
          paradaAnterior()
          return
        case 'Home':
          e.preventDefault()
          desplazarA(0)
          return
        case 'End':
          e.preventDefault()
          irAParada('fin')
          return
        case 'Escape':
          setAyuda(false)
          setConfirmar(false)
          return
        case '?':
          setAyuda((v) => !v)
          return
      }

      // Con una pregunta abierta, cualquier letra empieza a escribir la respuesta.
      const campo = campoVisible()
      if (campo && e.key.length === 1) {
        campo.focus()
        return
      }
      // Sin atajos de otras letras: escribir un nombre antes de tiempo no debe revelar nada.
      if (e.key === 'f' || e.key === 'F') alternarPantallaCompleta()
    }
    window.addEventListener('keydown', alPresionar)
    return () => window.removeEventListener('keydown', alPresionar)
  }, [avanzar])

  // Ronda actual (para los puntitos de la barra)
  useEffect(() => {
    let frame = 0
    const medir = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setActual(rondaEnPantalla()))
    }
    medir()
    window.addEventListener('scroll', medir, { passive: true })
    window.addEventListener('resize', medir)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', medir)
      window.removeEventListener('resize', medir)
    }
  }, [])

  // Modo presentación: pantalla completa + barra y cursor que se esconden solos
  useEffect(() => {
    const alCambiar = () => setPantallaCompleta(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', alCambiar)
    return () => document.removeEventListener('fullscreenchange', alCambiar)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('presentando', pantallaCompleta)
    document.documentElement.classList.toggle('inactivo', pantallaCompleta && !activo)
  }, [pantallaCompleta, activo])

  useEffect(() => {
    let espera = 0
    const despertar = () => {
      setActivo(true)
      window.clearTimeout(espera)
      espera = window.setTimeout(() => setActivo(false), INACTIVIDAD_MS)
    }
    despertar()
    window.addEventListener('mousemove', despertar)
    window.addEventListener('keydown', despertar)
    return () => {
      window.clearTimeout(espera)
      window.removeEventListener('mousemove', despertar)
      window.removeEventListener('keydown', despertar)
    }
  }, [])

  const { scrollYProgress } = useScroll()
  const progreso = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const rondaResuelta = actual ? Boolean(resultados[actual]) : true

  return (
    <>
      <motion.div className="progreso-lectura" style={{ scaleX: progreso }} aria-hidden="true" />

      <nav
        className={`barra ${activo || ayuda || confirmar ? 'barra--visible' : ''}`}
        aria-label="Controles de presentación"
      >
        <button className="barra__boton" onClick={paradaAnterior} title="Anterior (←)" aria-label="Anterior">
          <Icono d="M15 5l-7 7 7 7" />
        </button>
        <button className="barra__boton" onClick={avanzar} title="Siguiente (espacio / →)" aria-label="Siguiente">
          <Icono d="M9 5l7 7-7 7" />
        </button>

        {BEBES.length > 0 && (
          <span className="barra__puntos">
            {BEBES.map((b, i) => {
              const r = resultados[b.id]
              const estado = r ? (r.correcta ? 'acierto' : 'fallo') : 'pendiente'
              return (
                <button
                  key={b.id}
                  className={`barra__punto barra__punto--${estado} ${actual === b.id ? 'barra__punto--actual' : ''}`}
                  onClick={() => irAParada(`ronda-${b.id}`)}
                  title={`Ir al bebé ${i + 1}`}
                  aria-label={`Ir al bebé ${i + 1}`}
                />
              )
            })}
          </span>
        )}

        <button
          className="barra__boton barra__boton--texto"
          onClick={revelarActual}
          disabled={rondaResuelta}
          title="Revelar el nombre de este bebé"
        >
          Revelar
        </button>
        <button
          className="barra__boton"
          onClick={alternarPantallaCompleta}
          title="Pantalla completa (F)"
          aria-label="Pantalla completa"
        >
          <Icono d={pantallaCompleta ? 'M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5' : 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5'} />
        </button>
        {confirmar ? (
          <span className="barra__confirmar">
            ¿Reiniciar?
            <button className="barra__boton barra__boton--texto" onClick={hacerReinicio}>
              Sí
            </button>
            <button className="barra__boton barra__boton--texto" onClick={() => setConfirmar(false)}>
              No
            </button>
          </span>
        ) : (
          <button className="barra__boton" onClick={() => setConfirmar(true)} title="Reiniciar el juego" aria-label="Reiniciar el juego">
            <Icono d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" />
          </button>
        )}
        <button className="barra__boton" onClick={() => setAyuda((v) => !v)} title="Atajos de teclado (?)" aria-label="Atajos de teclado">
          <Icono d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.01" />
        </button>
      </nav>

      <AnimatePresence>
        {aviso && (
          <motion.p
            className="aviso-flotante"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            role="status"
          >
            {aviso}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {ayuda && (
          <motion.div
            className="ayuda"
            onClick={() => setAyuda(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="ayuda__tarjeta"
              role="dialog"
              aria-label="Atajos de teclado"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              <h2 className="manuscrita">Para quien presenta</h2>
              <dl>
                <dt><kbd>espacio</kbd> <kbd>→</kbd> <kbd>↓</kbd></dt>
                <dd>Avanzar al siguiente momento de la historia</dd>
                <dt><kbd>←</kbd> <kbd>↑</kbd></dt>
                <dd>Volver atrás (por ejemplo, para ver otra vez una foto)</dd>
                <dt>Escribir</dt>
                <dd>Con la pregunta en pantalla, solo empiecen a escribir; <kbd>enter</kbd> envía</dd>
                <dt>Revelar</dt>
                <dd>Botón de la barra: muestra el nombre del bebé en pantalla</dd>
                <dt><kbd>F</kbd></dt>
                <dd>Pantalla completa / modo presentación</dd>
                <dt><kbd>inicio</kbd> <kbd>fin</kbd></dt>
                <dd>Ir a la portada / al cierre</dd>
                <dt><kbd>esc</kbd></dt>
                <dd>Salir del campo de texto o cerrar esta ayuda</dd>
              </dl>
              <p className="ayuda__nota">Los puntitos de la barra llevan directo a cada bebé.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
