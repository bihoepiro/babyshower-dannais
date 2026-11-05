import { memo, useMemo } from 'react'
import { BASE_DATOS, BIBERON, CHUPON, COPO, PANAL, SONAJERO, Sprite, TERMINAL, type DatosSprite } from '../sprites'

/** Generador pseudoaleatorio con semilla: la ciudad sale igual en cada carga. */
function azar(semilla: number) {
  return () => {
    semilla = (semilla + 0x6d2b79f5) | 0
    let t = Math.imul(semilla ^ (semilla >>> 15), 1 | semilla)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const EDIFICIOS = ['#ff6b1a', '#22c55e', '#2c5cf6', '#3b47b8', '#ff6b1a', '#1aa34a']
const VENTANAS = ['#ffd23f', '#fff1c4', '#35e0ff']

function Ciudad() {
  const { edificios, ventanas } = useMemo(() => {
    const r = azar(42)
    const edificios: { x: number; y: number; w: number; h: number; c: string }[] = []
    const ventanas: { x: number; y: number; c: string }[] = []
    let x = -4
    while (x < 324) {
      const torre = x > 146 && x < 170 && !edificios.some((e) => e.h > 70)
      const w = torre ? 20 : 12 + Math.floor(r() * 20)
      const h = torre ? 84 : 18 + Math.floor(r() * 46)
      const c = torre ? '#22c55e' : EDIFICIOS[Math.floor(r() * EDIFICIOS.length)]
      edificios.push({ x, y: 96 - h, w, h, c })
      if (torre) {
        edificios.push({ x: x + 6, y: 96 - h - 8, w: 8, h: 8, c })
        edificios.push({ x: x + 9, y: 96 - h - 16, w: 2, h: 8, c: '#ffd23f' })
      }
      for (let vy = 96 - h + 4; vy < 92; vy += 5) {
        for (let vx = x + 3; vx < x + w - 3; vx += 4) {
          if (r() < 0.5) ventanas.push({ x: vx, y: vy, c: VENTANAS[Math.floor(r() * VENTANAS.length)] })
        }
      }
      x += w + (r() < 0.3 ? 2 : 0)
    }
    return { edificios, ventanas }
  }, [])

  return (
    <svg className="ciudad" viewBox="0 0 320 96" preserveAspectRatio="xMidYMax slice" shapeRendering="crispEdges" aria-hidden="true">
      {edificios.map((e, i) => (
        <g key={i}>
          <rect x={e.x} y={e.y} width={e.w} height={e.h} fill={e.c} />
          <rect x={e.x} y={e.y} width={1} height={e.h} fill="#ffffff" opacity="0.18" />
          <rect x={e.x + e.w - 2} y={e.y} width={2} height={e.h} fill="#000" opacity="0.25" />
        </g>
      ))}
      {ventanas.map((v, i) => (
        <rect key={i} x={v.x} y={v.y} width={2} height={2} fill={v.c} />
      ))}
    </svg>
  )
}

const FLOTANTES: { sprite?: DatosSprite; texto?: string; x: number; y: number; t: number; d: number }[] = [
  { sprite: BIBERON, x: 6, y: 18, t: 3.2, d: 0 },
  { sprite: COPO, x: 88, y: 14, t: 4.4, d: 1.1 },
  { sprite: PANAL, x: 15, y: 46, t: 4.2, d: 0.6 },
  { sprite: BASE_DATOS, x: 92, y: 42, t: 3.6, d: 0.2 },
  { sprite: CHUPON, x: 30, y: 8, t: 3.8, d: 1.6 },
  { sprite: TERMINAL, x: 72, y: 6, t: 4.8, d: 0.9 },
  { sprite: SONAJERO, x: 3, y: 64, t: 3.4, d: 1.3 },
  { sprite: COPO, x: 60, y: 24, t: 5.2, d: 2 },
  { texto: '01', x: 80, y: 60, t: 3, d: 0.4 },
  { texto: '10', x: 24, y: 28, t: 3.6, d: 1.8 },
  { texto: 'ETL', x: 96, y: 66, t: 4, d: 0.7 },
]

export const Fondo = memo(function Fondo({ tono }: { tono: string }) {
  const estrellas = useMemo(() => {
    const r = azar(7)
    return Array.from({ length: 46 }, () => ({ x: r() * 100, y: r() * 55, d: r() * 3, t: 1.6 + r() * 2 }))
  }, [])

  return (
    <div className={`fondo fondo--${tono}`} aria-hidden="true">
      <div className="fondo__brillo" />
      <div className="fondo__tramado" />
      {estrellas.map((e, i) => (
        <span
          key={i}
          className="estrella"
          style={{ left: `${e.x}%`, top: `${e.y}%`, animationDelay: `${-e.d}s`, animationDuration: `${e.t}s` }}
        />
      ))}
      {FLOTANTES.map((f, i) => (
        <div
          key={i}
          className={`flotante ${f.texto ? 'flotante--texto' : ''}`}
          style={{ left: `${f.x}%`, top: `${f.y}%`, animationDuration: `${f.t}s`, animationDelay: `${-f.d}s` }}
        >
          {f.sprite ? <Sprite sprite={f.sprite} /> : f.texto}
        </div>
      ))}
      <Ciudad />
    </div>
  )
})

/** Líneas de barrido y viñeta de monitor CRT, por encima de todo. */
export function Crt() {
  return (
    <div className="crt" aria-hidden="true">
      <div className="crt__lineas" />
      <div className="crt__vineta" />
    </div>
  )
}
