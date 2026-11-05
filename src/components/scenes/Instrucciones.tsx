import { motion, type MotionValue } from 'framer-motion'
import { BEBES } from '../../data/bebes'
import { useAparicion } from '../../hooks/useAparicion'
import { irAParada } from '../../hooks/navegacion'
import { Escena } from '../Escena'
import { Bocadillo } from '../Bocadillo'
import { Estrella, Globo } from '../illustrations/Decoraciones'

const PASOS = [
  {
    titulo: 'Observen',
    texto: 'La foto se irá revelando poco a poco.',
    icono: (
      <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12zm10 3a3 3 0 100-6 3 3 0 000 6z" />
    ),
  },
  {
    titulo: 'Conversen',
    texto: 'Debatan y pónganse de acuerdo.',
    icono: (
      <path d="M4 5h11a2 2 0 012 2v5a2 2 0 01-2 2H9l-4 3v-3H4a2 2 0 01-2-2V7a2 2 0 012-2zm15 4h1a2 2 0 012 2v5a2 2 0 01-2 2h-1v3l-4-3h-3" />
    ),
  },
  {
    titulo: 'Adivinen',
    texto: 'Escriban el nombre y descubran si le atinaron.',
    icono: <path d="M15.5 4.5l4 4L8 20H4v-4L15.5 4.5zM13 7l4 4" />,
  },
]

export function Instrucciones() {
  return (
    <Escena id="instrucciones" alto={240} paradas={[{ id: 'juego', p: 0.56 }]} className="escena--papel">
      {(p) => <Escenario p={p} />}
    </Escena>
  )
}

function Escenario({ p }: { p: MotionValue<number> }) {
  const tarjeta = useAparicion(p, 0.0, 0.14, 30)
  const titulo = useAparicion(p, 0.08, 0.2)
  const intro = useAparicion(p, 0.16, 0.26)
  const pasos = [useAparicion(p, 0.24, 0.32), useAparicion(p, 0.29, 0.37), useAparicion(p, 0.34, 0.42)]
  const cierre = useAparicion(p, 0.4, 0.5)
  const primera = BEBES[0]

  return (
    <div className="instrucciones">
      <div className="marco-pagina" aria-hidden="true" />
      <div className="flotar flotar--lento instrucciones__globo instrucciones__globo--izq" aria-hidden="true">
        <Globo tono="palido" cordel={90} />
      </div>
      <div className="flotar instrucciones__globo instrucciones__globo--der" aria-hidden="true">
        <Globo cordel={80} />
      </div>

      <motion.article className="tarjeta" style={tarjeta}>
        <motion.header style={titulo}>
          <p className="versalitas">Un juego para el equipo</p>
          <h2 className="manuscrita tarjeta__titulo">¿Quién es ese bebé?</h2>
        </motion.header>
        <motion.p className="tarjeta__intro" style={intro}>
          Vamos a descubrir quiénes se esconden detrás de estas pequeñas caritas.
          Observen bien y prepárense para adivinar.
        </motion.p>

        <ol className="pasos">
          {PASOS.map((paso, i) => (
            <motion.li key={paso.titulo} className="paso" style={pasos[i]}>
              <span className="paso__icono" aria-hidden="true">
                <svg viewBox="0 0 24 24">{paso.icono}</svg>
              </span>
              <h3 className="paso__titulo">{paso.titulo}</h3>
              <p>{paso.texto}</p>
            </motion.li>
          ))}
        </ol>

        <motion.div style={cierre}>
          <Bocadillo className="tarjeta__bocadillo">
            Ustedes analizan datos todos los días… pero hoy el dataset son {BEBES.length} fotos de bebés: puros
            cachetes, pañales y sonrisas sin dientes.
          </Bocadillo>
          {primera ? (
            <button className="boton boton--principal" onClick={() => irAParada(`ronda-${primera.id}`)}>
              <Estrella className="boton__estrella" color="currentColor" />
              Comenzar el juego
            </button>
          ) : (
            <p className="aviso">
              Aún no hay fotos en la carpeta <code>fotos/</code>. Agrega imágenes y vuelve a compilar.
            </p>
          )}
        </motion.div>
      </motion.article>
    </div>
  )
}
