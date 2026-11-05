import { motion, useTransform, type MotionValue } from 'framer-motion'
import { EVENTO } from '../../data/config'
import { useAparicion } from '../../hooks/useAparicion'
import { Arco } from '../Arco'
import { Escena } from '../Escena'
import { Estrella, Globo, Nube, Separador } from '../illustrations/Decoraciones'
import { Oso } from '../illustrations/Oso'

const entrada = (retraso: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.6, delay: retraso, ease: [0.22, 1, 0.36, 1] as const },
})

export function Portada() {
  return (
    <Escena
      id="portada"
      alto={380}
      paradas={[
        { id: 'portada', p: 0 },
        { id: 'portada-mensaje', p: 0.5 },
      ]}
    >
      {(p) => <Escenario p={p} />}
    </Escena>
  )
}

function Escenario({ p }: { p: MotionValue<number> }) {
  const invitacion = useTransform(p, [0.08, 0.22], [1, 0])
  const invitacionY = useTransform(p, [0.08, 0.22], [0, -26])
  const linea1 = useAparicion(p, 0.22, 0.32)
  const linea2 = useAparicion(p, 0.33, 0.43)
  const firma = useAparicion(p, 0.42, 0.5, 10)
  const pista = useTransform(p, [0, 0.04], [1, 0])

  // Al final, la cámara "entra" en la invitación.
  const escala = useTransform(p, [0.66, 1], [1, 3.6])
  const contenido = useTransform(p, [0.64, 0.8], [1, 0])
  const rayas = useTransform(p, [0.8, 0.98], [1, 0])
  const subida = useTransform(p, [0, 0.7], [0, -140])

  return (
    <Arco
      escala={escala}
      rayas={rayas}
      fondo={
        <motion.div className="portada__globos-lejanos" style={{ y: subida, opacity: contenido }} aria-hidden="true">
          <motion.div {...entrada(1.2)} className="flotar flotar--lento portada__globo-izq">
            <Globo tono="palido" cordel={70} />
          </motion.div>
          <motion.div {...entrada(1.5)} className="flotar portada__globo-der">
            <Globo tono="crema" cordel={60} />
          </motion.div>
        </motion.div>
      }
    >
      <motion.div className="portada" style={{ opacity: contenido }}>
        <div className="portada__ilustracion">
          <Nube className="deriva portada__nube portada__nube--1" />
          <Nube className="deriva deriva--inversa portada__nube portada__nube--2" />
          <motion.div {...entrada(0.4)} className="portada__osito balanceo">
            <Oso />
          </motion.div>
          <motion.div {...entrada(0.8)} className="portada__globo flotar">
            <Globo cordel={120} />
          </motion.div>
          <Estrella className="titilar portada__estrella portada__estrella--1" />
          <Estrella className="titilar titilar--2 portada__estrella portada__estrella--2" color="#b9cdea" />
          <Estrella className="titilar titilar--3 portada__estrella portada__estrella--3" />
        </div>

        <div className="portada__textos">
          <motion.div className="portada__invitacion" style={{ opacity: invitacion, y: invitacionY }}>
            <motion.p {...entrada(1.1)} className="versalitas portada__antetitulo">
              ¡Una pequeña personita está por llegar!
            </motion.p>
            <motion.h1 {...entrada(1.4)} className="manuscrita portada__nombre">
              {EVENTO.bebe}
            </motion.h1>
            <motion.p {...entrada(1.7)} className="versalitas portada__evento">
              Baby shower de {EVENTO.mama}
            </motion.p>
            <motion.div {...entrada(1.9)}>
              <Separador />
              {EVENTO.fecha && <p className="versalitas portada__dato">{EVENTO.fecha}</p>}
              {EVENTO.lugar && <p className="versalitas portada__dato">{EVENTO.lugar}</p>}
            </motion.div>
          </motion.div>

          <div className="portada__mensaje">
            <motion.p className="cita" style={linea1}>
              «Pronto llegaré a la vida de mis papás…
            </motion.p>
            <motion.p className="cita" style={linea2}>
              …y ya tengo un montón de personas increíbles esperándome.»
            </motion.p>
            <motion.p className="manuscrita firma" style={firma}>
              Noah
            </motion.p>
          </div>
        </div>

        <motion.div className="pista-scroll" style={{ opacity: pista }}>
          <motion.span {...entrada(2.4)}>
            Desliza<span className="solo-teclado"> o presiona <kbd>espacio</kbd></span>
            <svg viewBox="0 0 24 24" className="pista-scroll__flecha" aria-hidden="true">
              <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </motion.span>
        </motion.div>
      </motion.div>
    </Arco>
  )
}
