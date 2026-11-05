import { motion, useTransform, type MotionValue } from 'framer-motion'
import { MAMA } from '../../data/bebes'
import { EVENTO } from '../../data/config'
import { useAparicion } from '../../hooks/useAparicion'
import { Arco } from '../Arco'
import { Escena } from '../Escena'
import { Estrella, Globo, Nube } from '../illustrations/Decoraciones'
import { Oso } from '../illustrations/Oso'

/** Cierre, pantalla 1: Noah agradece por jugar. */
export function Final() {
  return (
    <Escena id="gracias" alto={300} paradas={[{ id: 'gracias', p: 0.56 }]}>
      {(p) => <Escenario p={p} />}
    </Escena>
  )
}

function Escenario({ p }: { p: MotionValue<number> }) {
  // Salimos de la invitación hasta verla completa… y al final volvemos a entrar en ella.
  const escala = useTransform(p, [0, 0.36, 0.78, 1], [3.6, 1, 1, 3.6])
  const rayas = useTransform(p, [0.05, 0.28, 0.8, 0.98], [0, 1, 1, 0])
  const contenido = useTransform(p, [0.74, 0.86], [1, 0])
  const ilustracion = useAparicion(p, 0.22, 0.34)
  const gracias = useAparicion(p, 0.3, 0.4)
  const mensaje = useAparicion(p, 0.38, 0.48)
  const firma = useAparicion(p, 0.46, 0.54, 10)
  const adelanto = useAparicion(p, 0.5, 0.56, 10)

  return (
    <Arco
      escala={escala}
      rayas={rayas}
      fondo={
        <motion.div className="portada__globos-lejanos" style={{ opacity: rayas }} aria-hidden="true">
          <div className="flotar flotar--lento portada__globo-izq">
            <Globo tono="palido" cordel={70} />
          </div>
          <div className="flotar portada__globo-der">
            <Globo tono="crema" cordel={60} />
          </div>
        </motion.div>
      }
    >
      <motion.div className="final" style={{ opacity: contenido }}>
        <motion.div className="final__ilustracion" style={ilustracion}>
          <Nube className="deriva final__nube" />
          <div className="final__osito balanceo">
            <Oso />
          </div>
          <div className="final__globo final__globo--1 flotar">
            <Globo cordel={110} />
          </div>
          <div className="final__globo final__globo--2 flotar flotar--lento">
            <Globo tono="palido" cordel={110} />
          </div>
          <Estrella className="titilar final__estrella" />
        </motion.div>

        <motion.p className="versalitas final__gracias" style={gracias}>
          Gracias por jugar conmigo
        </motion.p>
        <motion.div className="final__mensaje" style={mensaje}>
          <p>Ahora ya sé cómo eran mis tíos y tías de oficina cuando eran chiquititos… ¡y no han cambiado tanto!</p>
          <p>Muy pronto nos vamos a conocer en persona. Mientras tanto, cuiden mucho a mi mamá.</p>
        </motion.div>
        <motion.div className="final__firma" style={firma}>
          <span className="versalitas">Con amor,</span>
          <span className="manuscrita final__nombre">{EVENTO.bebe}</span>
        </motion.div>

        <motion.p className="final__adelanto" style={adelanto}>
          {MAMA ? 'Pero espera… todavía me queda una sorpresa' : 'Y ahora, miren cómo eran todos'}
          <svg viewBox="0 0 24 24" className="pista-scroll__flecha" aria-hidden="true">
            <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </motion.p>
      </motion.div>
    </Arco>
  )
}
