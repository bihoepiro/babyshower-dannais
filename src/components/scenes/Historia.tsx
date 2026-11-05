import { motion, useTransform, type MotionValue } from 'framer-motion'
import { BEBES } from '../../data/bebes'
import { useJuego } from '../../game/JuegoContext'
import { useAparicion, useLinea } from '../../hooks/useAparicion'
import { Bocadillo } from '../Bocadillo'
import { Escena } from '../Escena'
import { Estrella, Globo, Nube } from '../illustrations/Decoraciones'
import { Oso } from '../illustrations/Oso'

const LINEAS = [
  'Mi mamá tiene un equipo increíble que la acompaña día a día en la oficina.',
  'Dicen que son gente muy seria: hablan de datos, dashboards y líneas de código… ¡hasta en el almuerzo!',
  'Pero antes de ser grandes, profesionales y expertos en tecnología… todos fueron chiquititos, igualito que yo.',
  'Por eso hoy quiero conocerlos de una forma diferente. ¿Podrás descubrir quiénes son mis futuros tíos y tías de oficina?',
]

// Cada línea ocupa un tramo del scroll; la parada queda en el centro del tramo.
const TRAMOS = [
  [0.04, 0.28],
  [0.28, 0.52],
  [0.52, 0.74],
  [0.74, 1],
] as const

export function Historia() {
  return (
    <Escena
      id="historia"
      alto={520}
      paradas={TRAMOS.map(([a, b], i) => ({ id: `historia-${i + 1}`, p: i === TRAMOS.length - 1 ? 0.86 : (a + b) / 2 + 0.02 }))}
      className="escena--papel"
    >
      {(p) => <Escenario p={p} />}
    </Escena>
  )
}

/** Curva del tendedero (bézier cuadrática) en fracción del alto: extremos en BORDE, control en CONTROL. */
const BORDE = 0.14
const CONTROL = 0.58
const caida = (x: number) => BORDE + 2 * x * (1 - x) * (CONTROL - BORDE)

function Escenario({ p }: { p: MotionValue<number> }) {
  const { resultados } = useJuego()
  const cordel = useTransform(p, [0.02, 0.14], [0, 1])
  const comentario = useAparicion(p, 0.3, 0.38, 10)
  const narrador = useAparicion(p, 0.02, 0.1)
  const n = BEBES.length
  const identificados = BEBES.filter((b) => resultados[b.id]).length

  return (
    <div className="historia">
      <div className="marco-pagina" aria-hidden="true" />
      <Nube className="deriva historia__nube historia__nube--1" />
      <Nube className="deriva deriva--inversa historia__nube historia__nube--2" />

      <div className="tendedero" aria-hidden="true">
        <svg className="tendedero__cordel" viewBox="0 0 1000 300" preserveAspectRatio="none">
          <motion.path
            d={`M0 ${BORDE * 300} Q500 ${CONTROL * 300} 1000 ${BORDE * 300}`}
            fill="none"
            stroke="#c6ad8a"
            strokeWidth="1.1"
            style={{ pathLength: cordel }}
          />
        </svg>
        {BEBES.map((b, i) => (
          <FotoColgada key={b.id} p={p} indice={i} total={n} x={(i + 0.5) / n} />
        ))}
      </div>

      {n > 0 && (
        <motion.div className="historia__comentario" style={comentario}>
          <Bocadillo conNoah={false} colita="derecha">
            {identificados === 0
              ? `¿Ves esas fotitos? Son ${n} bebés misteriosos… ¡y todavía no descubrimos a ninguno!`
              : identificados < n
                ? `¡Ya descubrimos a ${identificados} de los ${n} bebés misteriosos!`
                : `¡Ya descubrimos a los ${n} bebés misteriosos! 🎉`}
          </Bocadillo>
        </motion.div>
      )}

      <div className="historia__texto">
        {LINEAS.map((texto, i) => (
          <Linea key={i} p={p} tramo={TRAMOS[i]} texto={texto} />
        ))}
      </div>

      <motion.div className="historia__narrador" style={narrador} aria-hidden="true">
        <div className="flotar flotar--lento historia__globito">
          <Globo cordel={70} />
        </div>
        <Oso className="balanceo" />
        <Estrella className="titilar historia__estrellita" />
      </motion.div>
    </div>
  )
}

function Linea({ p, tramo, texto }: { p: MotionValue<number>; tramo: readonly [number, number]; texto: string }) {
  const estilo = useLinea(p, tramo[0], tramo[1])
  return (
    <motion.p className="historia__linea" style={estilo}>
      {texto}
    </motion.p>
  )
}

function FotoColgada({ p, indice, total, x }: { p: MotionValue<number>; indice: number; total: number; x: number }) {
  const inicio = 0.06 + (indice / Math.max(total, 1)) * 0.14
  const opacity = useTransform(p, [inicio, inicio + 0.05], [0, 1])
  const y = useTransform(p, [inicio, inicio + 0.05], [-40, 0])
  return (
    <motion.div
      className="colgada"
      style={{
        left: `${x * 100}%`,
        top: `${caida(x) * 100}%`,
        opacity,
        y,
        ['--ancho' as string]: `clamp(30px, min(9.5vw, ${78 / total}vw), 128px)`,
        ['--retraso' as string]: `${-indice * 0.7}s`,
      }}
    >
      <div className="colgada__balanceo">
        <span className="colgada__pinza" />
        <div className="colgada__foto">
          <span className="manuscrita">?</span>
        </div>
      </div>
    </motion.div>
  )
}
