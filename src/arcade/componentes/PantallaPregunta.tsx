import { AnimatePresence, motion } from 'framer-motion'
import { LETRAS, PREGUNTAS, PUNTOS, type Letra, type Pregunta } from '../preguntas'
import { BEBE, CORONA, INGENIERO, Sprite } from '../sprites'
import { Explosion, Panalazo, Texto, pasos, relleno } from './Comunes'

const EQUIPOS = { data: 'DATA ENGINEER', baby: 'BABY ENGINEER', bonus: 'BONUS · PADRINO BELCORP' }

export function PantallaPregunta({
  pregunta,
  indice,
  elegida,
  revelada,
  onElegir,
  onSiguiente,
}: {
  pregunta: Pregunta
  indice: number
  elegida: Letra | null
  revelada: boolean
  onElegir: (l: Letra) => void
  onSiguiente: () => void
}) {
  const acerto = revelada && elegida === pregunta.correcta
  const bonus = pregunta.equipo === 'bonus'
  const ultima = indice === PREGUNTAS.length - 1

  const estadoOpcion = (l: Letra) => {
    if (!elegida) return 'normal'
    if (!revelada) return l === elegida ? 'elegida' : 'apagada'
    if (l === pregunta.correcta) return 'correcta'
    if (l === elegida) return 'incorrecta'
    return 'apagada'
  }

  return (
    <div className={`pregunta pregunta--${pregunta.equipo} ${revelada && !acerto ? 'temblor' : ''}`}>
      <aside className="pregunta__lado">
        <AnimatePresence>
          {revelada && (
            <motion.div
              className={`globo-pixel resultado ${acerto ? 'resultado--ok' : 'resultado--mal'}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: pasos(4) }}
            >
              <p className="resultado__titulo">{acerto ? (bonus ? '¡BONUS!' : '¡CORRECTO!') : '¡OOPS!'}</p>
              <p className="resultado__puntos">
                {acerto ? `+${bonus ? PUNTOS.bonus : PUNTOS.normal} PTS` : '+0 PTS'}
              </p>
              <p className="resultado__respuesta">
                Respuesta: <strong>{pregunta.correcta})</strong> <Texto>{pregunta.opciones[pregunta.correcta]}</Texto>
              </p>
              {pregunta.explicacion && (
                <p className="resultado__explicacion">
                  <Texto>{pregunta.explicacion}</Texto>
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="personaje">
          {bonus && <Sprite sprite={CORONA} className="personaje__corona saltito" />}
          <Sprite
            sprite={pregunta.equipo === 'data' ? INGENIERO : BEBE}
            paleta={bonus ? { h: '#35c6ff', H: '#2c5cf6' } : undefined}
            className={`personaje__sprite ${revelada ? (acerto ? 'festejo' : 'mareo') : 'saltito'}`}
          />
          <div className={`plataforma plataforma--${pregunta.equipo}`} />
        </div>
        <p className="personaje__nombre">{bonus ? 'NOAH' : EQUIPOS[pregunta.equipo]}</p>
      </aside>

      <section className="pregunta__principal">
        <header className="pregunta__cabecera">
          <span className="etiqueta">
            PREGUNTA {relleno(indice + 1, 2)}/{PREGUNTAS.length}
          </span>
          <span className={`etiqueta etiqueta--${pregunta.equipo}`}>{EQUIPOS[pregunta.equipo]}</span>
        </header>

        <div className="tarjeta-pixel">
          <h2 className="pregunta__titulo">{pregunta.titulo}</h2>
          {pregunta.intro && <p className="pregunta__intro">{pregunta.intro}</p>}
          <p className="pregunta__enunciado">
            <Texto>{pregunta.enunciado}</Texto>
          </p>
        </div>

        <div className="opciones" role="group" aria-label="Alternativas">
          {LETRAS.map((l, i) => (
            <motion.button
              key={`${pregunta.numero}-${l}`}
              className={`opcion opcion--${l} opcion--${estadoOpcion(l)}`}
              onClick={() => onElegir(l)}
              disabled={Boolean(elegida)}
              initial={{ x: 120, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.12, ease: pasos(4) }}
              data-letra={l}
            >
              <span className="opcion__boton">{l}</span>
              <span className="opcion__texto">
                <Texto>{pregunta.opciones[l]}</Texto>
              </span>
              {revelada && l === pregunta.correcta && <span className="opcion__marca">✓</span>}
              {revelada && l === elegida && l !== pregunta.correcta && <span className="opcion__marca">✗</span>}
            </motion.button>
          ))}
        </div>

        <div className="pregunta__pie">
          {revelada ? (
            <motion.button
              className="boton-arcade boton-arcade--chico"
              onClick={onSiguiente}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, ease: pasos(3) }}
              autoFocus
            >
              {ultima ? 'VER RESULTADOS ▶' : 'SIGUIENTE ▶'}
            </motion.button>
          ) : (
            <p className="pregunta__ayuda">
              {elegida ? <span className="parpadeo">ANALIZANDO RESPUESTA…</span> : 'Elijan con A · B · C o con un clic'}
            </p>
          )}
        </div>
      </section>

      {revelada && (acerto ? <Explosion cantidad={bonus ? 90 : 46} /> : <Panalazo />)}
    </div>
  )
}
