import { useTransform, type MotionValue } from 'framer-motion'

/** Fundido + leve subida mientras el progreso pasa de `inicio` a `fin`. */
export function useAparicion(progreso: MotionValue<number>, inicio: number, fin = inicio + 0.08, distancia = 22) {
  const opacity = useTransform(progreso, [inicio, fin], [0, 1])
  const y = useTransform(progreso, [inicio, fin], [distancia, 0])
  return { opacity, y }
}

/**
 * Para textos que se suceden: aparece en `inicio`, se mantiene y se desvanece
 * hacia arriba en `fin`. Con `fin` = 1 se queda visible hasta el final.
 */
export function useLinea(progreso: MotionValue<number>, inicio: number, fin: number, transicion = 0.06) {
  const sale = fin < 1
  const puntos = sale ? [inicio, inicio + transicion, fin - transicion, fin] : [inicio, inicio + transicion]
  const opacity = useTransform(progreso, puntos, sale ? [0, 1, 1, 0] : [0, 1])
  const y = useTransform(progreso, puntos, sale ? [26, 0, 0, -26] : [26, 0])
  return { opacity, y }
}
