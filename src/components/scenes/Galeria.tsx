import { motion } from 'framer-motion'
import { BEBES } from '../../data/bebes'
import { useJuego } from '../../game/JuegoContext'
import { desplazarA, irAParada } from '../../hooks/navegacion'
import { Bocadillo } from '../Bocadillo'
import { Separador } from '../illustrations/Decoraciones'
import { Polaroid } from '../Polaroid'

const formatoPorcentaje = new Intl.NumberFormat('es', { maximumFractionDigits: 1 })

/** Cierre, pantalla 3: la galería de recuerdos de infancia, ya sin misterio. */
export function Galeria() {
  const { resultados, aciertos, reiniciar } = useJuego()
  const total = BEBES.length
  const jugadas = Object.keys(resultados).length
  const precision = jugadas ? (aciertos / jugadas) * 100 : 0

  const volverAJugar = () => {
    reiniciar()
    irAParada('juego')
  }

  return (
    <section id="galeria" className="galeria escena--papel">
      <span className="parada" data-parada="galeria" style={{ top: 0 }} aria-hidden="true" />
      <div className="marco-pagina marco-pagina--fluido" aria-hidden="true" />

      <motion.header
        className="galeria__cabecera"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.6 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="versalitas">Recuerdos de infancia</p>
        <h2 className="manuscrita galeria__titulo">Mis tíos y tías de oficina</h2>
        <p className="galeria__subtitulo">Así eran antes de convertirse en los grandes profesionales que mi mamá conoce.</p>
        {jugadas > 0 && (
          <div className="marcador">
            <p className="marcador__principal">
              El equipo reconoció a <strong>{aciertos}</strong> de <strong>{total}</strong> bebés
            </p>
            <Bocadillo className="marcador__bocadillo">
              Según mis cálculos, la precisión del modelo humano fue de {formatoPorcentaje.format(precision)}%… ¡y
              el margen de ternura, infinito!
            </Bocadillo>
          </div>
        )}
        <Separador />
      </motion.header>

      <span className="parada parada--flujo" data-parada="galeria-fotos" aria-hidden="true" />
      <div className="galeria__rejilla">
        {BEBES.map((b, i) => {
          const r = resultados[b.id]
          return (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1, delay: (i % 4) * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <Polaroid
                giro={[-3, 2, -1.5, 3, -2.5, 1.5][i % 6]}
                className="galeria__polaroid"
                pie={
                  <>
                    <span className="manuscrita">{b.nombre}</span>
                    {r?.correcta && <span className="galeria__sello" title="¡Le atinaron!">✓</span>}
                  </>
                }
              >
                <img src={b.foto} alt={`${b.nombre} de bebé`} loading="lazy" decoding="async" />
              </Polaroid>
            </motion.div>
          )
        })}
      </div>

      <motion.footer
        className="galeria__cierre"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="parada parada--flujo" data-parada="fin" aria-hidden="true" />
        <Separador />
        <Bocadillo className="galeria__bocadillo">Fin del dataset… ¡y comienzo de la mejor aventura!</Bocadillo>
        <div className="galeria__botones">
          <button className="boton" onClick={volverAJugar}>
            Volver a jugar
          </button>
          <button className="boton boton--suave" onClick={() => desplazarA(0)}>
            Volver al inicio
          </button>
        </div>
      </motion.footer>
    </section>
  )
}
