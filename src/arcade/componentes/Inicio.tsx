import { motion } from 'framer-motion'
import { PREGUNTAS } from '../preguntas'
import { BASE_DATOS, BEBE, BIBERON, COPO, INGENIERO, SONAJERO, Sprite, TERMINAL } from '../sprites'
import { pasos, relleno } from './Comunes'

const entrada = (retraso: number, desde: 'arriba' | 'izquierda' | 'derecha' | 'abajo' = 'abajo') => {
  const offset = { arriba: { y: -60 }, abajo: { y: 60 }, izquierda: { x: -160 }, derecha: { x: 160 } }[desde]
  return {
    initial: { opacity: 0, ...offset },
    animate: { opacity: 1, x: 0, y: 0 },
    transition: { duration: 0.6, delay: retraso, ease: pasos(6) },
  }
}

export function Inicio({ record, onStart }: { record: number; onStart: () => void }) {
  return (
    <div className="inicio">
      <motion.p {...entrada(0.1, 'arriba')} className="inicio__credito">
        <span className="parpadeo">INSERT COIN</span>
        <span>CREDIT 01</span>
        <span>HI-SCORE {relleno(record)}</span>
      </motion.p>

      <h1 className="titulo" aria-label="Baby Engineer vs. Data Engineer">
        <motion.span {...entrada(0.2, 'izquierda')} className="titulo__linea titulo__linea--baby">
          BABY ENGINEER
        </motion.span>
        <motion.span
          className="titulo__vs"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: -6 }}
          transition={{ duration: 0.5, delay: 0.7, ease: pasos(5) }}
        >
          VS
        </motion.span>
        <motion.span {...entrada(0.45, 'derecha')} className="titulo__linea titulo__linea--data">
          DATA ENGINEER
        </motion.span>
      </h1>

      <motion.p {...entrada(0.9)} className="cinta">
        ★ NOAH EDITION ★
      </motion.p>

      <div className="duelo">
        <motion.div {...entrada(1.1, 'izquierda')} className="duelo__lado duelo__lado--baby">
          <Sprite sprite={BIBERON} className="duelo__objeto duelo__objeto--1 flotar" />
          <Sprite sprite={SONAJERO} className="duelo__objeto duelo__objeto--2 flotar flotar--lento" />
          <Sprite sprite={BEBE} className="duelo__personaje saltito" titulo="Baby Engineer" />
          <div className="plataforma plataforma--baby" />
          <span className="duelo__nombre">P1 · BABY</span>
        </motion.div>

        <motion.div {...entrada(1.35)} className="globo-pixel inicio__intro">
          <p>
            ¡Noah está por llegar! Y el equipo de tecnología tendrá que demostrar que sabe tanto de{' '}
            <em>pañales</em> como de <em>pipelines</em>.
          </p>
          <p className="inicio__reglas">
            {PREGUNTAS.length} preguntas · 2 universos · 1 bonus secreto
          </p>
        </motion.div>

        <motion.div {...entrada(1.1, 'derecha')} className="duelo__lado duelo__lado--data">
          <Sprite sprite={COPO} className="duelo__objeto duelo__objeto--1 flotar flotar--lento" />
          <Sprite sprite={BASE_DATOS} className="duelo__objeto duelo__objeto--2 flotar" />
          <Sprite sprite={TERMINAL} className="duelo__objeto duelo__objeto--3 flotar" />
          <Sprite sprite={INGENIERO} className="duelo__personaje saltito saltito--desfase" titulo="Data Engineer" />
          <div className="plataforma plataforma--data" />
          <span className="duelo__nombre">P2 · DATA</span>
        </motion.div>
      </div>

      <motion.div {...entrada(1.7)} className="inicio__accion">
        <button className="boton-arcade" onClick={onStart} autoFocus>
          <span className="boton-arcade__perilla" aria-hidden="true" />
          START GAME
        </button>
        <p className="parpadeo inicio__presiona">PRESIONA ENTER</p>
        <p className="inicio__teclas">
          <kbd>A</kbd>
          <kbd>B</kbd>
          <kbd>C</kbd> responder · <kbd>ENTER</kbd> continuar · <kbd>M</kbd> música · <kbd>F</kbd> pantalla completa
        </p>
      </motion.div>
    </div>
  )
}
