import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { PREGUNTAS, type Letra } from '../preguntas'
import { PANAL, Sprite } from '../sprites'

/** Muestra el texto y convierte lo que va entre `comillas invertidas` en código. */
export function Texto({ children }: { children: string }) {
  return (
    <>
      {children.split('`').map((parte, i) =>
        i % 2 ? (
          <code key={i} className="codigo">
            {parte}
          </code>
        ) : (
          parte
        ),
      )}
    </>
  )
}

export const relleno = (n: number, digitos = 6) => String(n).padStart(digitos, '0')

/** Movimiento "a saltos", como los sprites de 8 bits. */
export const pasos = (n: number) => (t: number) => Math.floor(t * n) / n

export function Hud({
  puntaje,
  record,
  indice,
  respuestas,
  musica,
  silencio,
  onMusica,
  onSilencio,
  onPantalla,
}: {
  puntaje: number
  record: number
  indice: number
  respuestas: (Letra | null)[]
  musica: boolean
  silencio: boolean
  onMusica: () => void
  onSilencio: () => void
  onPantalla: () => void
}) {
  return (
    <header className="hud">
      <div className="hud__bloque">
        <span className="hud__rotulo hud__rotulo--parpadeo">1UP</span>
        <span className="hud__valor">{relleno(puntaje)}</span>
      </div>
      <div className="hud__bloque hud__bloque--centro">
        <span className="hud__rotulo">
          PREGUNTA {relleno(Math.min(indice + 1, PREGUNTAS.length), 2)}/{PREGUNTAS.length}
        </span>
        <div className="progreso" aria-hidden="true">
          {PREGUNTAS.map((p, i) => {
            const r = respuestas[i]
            const estado = r ? (r === p.correcta ? 'ok' : 'mal') : i === indice ? 'actual' : 'pendiente'
            return <span key={i} className={`progreso__celda progreso__celda--${estado} ${p.equipo === 'bonus' ? 'progreso__celda--bonus' : ''}`} />
          })}
        </div>
      </div>
      <div className="hud__bloque hud__bloque--derecha">
        <span className="hud__rotulo">HI-SCORE</span>
        <span className="hud__valor hud__valor--record">{relleno(Math.max(record, puntaje))}</span>
      </div>
      <div className="hud__controles">
        <button className={`hud__boton ${musica ? '' : 'hud__boton--apagado'}`} onClick={onMusica} title="Música (M)">
          ♪
        </button>
        <button className={`hud__boton ${silencio ? 'hud__boton--apagado' : ''}`} onClick={onSilencio} title="Sonido (S)">
          {silencio ? '×' : '◀))'}
        </button>
        <button className="hud__boton" onClick={onPantalla} title="Pantalla completa (F)">
          ⛶
        </button>
      </div>
    </header>
  )
}

const COLORES = ['#ffd23f', '#ff3fa4', '#22c55e', '#35e0ff', '#ff6b1a', '#ffffff']

/** Estallido de píxeles para los aciertos. */
export function Explosion({ cantidad = 46 }: { cantidad?: number }) {
  const piezas = useMemo(
    () =>
      Array.from({ length: cantidad }, (_, i) => {
        const angulo = (i / cantidad) * Math.PI * 2 + Math.random() * 0.4
        const radio = 180 + Math.random() * 380
        return {
          x: Math.cos(angulo) * radio,
          y: Math.sin(angulo) * radio * 0.7,
          c: COLORES[i % COLORES.length],
          t: 6 + Math.floor(Math.random() * 3) * 6,
          d: Math.random() * 0.15,
        }
      }),
    [cantidad],
  )
  return (
    <div className="explosion" aria-hidden="true">
      {piezas.map((p, i) => (
        <motion.span
          key={i}
          className="explosion__pixel"
          style={{ background: p.c, width: p.t, height: p.t }}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 160], opacity: [1, 1, 0] }}
          transition={{ duration: 1.5, delay: p.d, ease: pasos(10) }}
        />
      ))}
    </div>
  )
}

/** Lluvia de pañales para los errores. */
export function Panalazo() {
  const panales = useMemo(
    () => Array.from({ length: 9 }, (_, i) => ({ x: 6 + i * 11 + Math.random() * 4, d: Math.random() * 0.5, g: Math.random() * 40 - 20 })),
    [],
  )
  return (
    <div className="panalazo" aria-hidden="true">
      {panales.map((p, i) => (
        <motion.div
          key={i}
          className="panalazo__panal"
          style={{ left: `${p.x}%` }}
          initial={{ y: '-20vh', rotate: 0 }}
          animate={{ y: '115vh', rotate: p.g }}
          transition={{ duration: 1.6, delay: p.d, ease: pasos(14) }}
        >
          <Sprite sprite={PANAL} />
        </motion.div>
      ))}
    </div>
  )
}
