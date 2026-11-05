import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { BEBES } from '../data/bebes'
import { esCorrecta } from './coincidencia'

export interface Resultado {
  respuesta: string
  correcta: boolean
  /** false = se reveló sin que el grupo adivinara. */
  adivinada: boolean
}

interface Juego {
  resultados: Record<string, Resultado>
  aciertos: number
  responder: (id: string, respuesta: string) => void
  revelar: (id: string) => void
  alternar: (id: string) => void
  deshacer: (id: string) => void
  reiniciar: () => void
}

const CLAVE = 'noah-babyshower-resultados-v1'
const JuegoContext = createContext<Juego | null>(null)

// sessionStorage: si la página se recarga durante el evento, las respuestas se conservan.
function leerGuardado(): Record<string, Resultado> {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE) ?? '{}')
  } catch {
    return {}
  }
}

export function JuegoProvider({ children }: { children: ReactNode }) {
  const [resultados, setResultados] = useState<Record<string, Resultado>>(leerGuardado)

  useEffect(() => {
    try {
      sessionStorage.setItem(CLAVE, JSON.stringify(resultados))
    } catch {
      /* sin almacenamiento: el juego funciona igual */
    }
  }, [resultados])

  const fijar = useCallback((id: string, valor: Resultado | null) => {
    setResultados((previo) => {
      const siguiente = { ...previo }
      if (valor) siguiente[id] = valor
      else delete siguiente[id]
      return siguiente
    })
  }, [])

  const responder = useCallback(
    (id: string, respuesta: string) => {
      const bebe = BEBES.find((b) => b.id === id)
      if (!bebe) return
      fijar(id, { respuesta: respuesta.trim(), correcta: esCorrecta(respuesta, bebe, BEBES), adivinada: true })
    },
    [fijar],
  )

  const revelar = useCallback(
    (id: string) => setResultados((p) => (p[id] ? p : { ...p, [id]: { respuesta: '', correcta: false, adivinada: false } })),
    [],
  )

  const alternar = useCallback(
    (id: string) =>
      setResultados((p) => (p[id] ? { ...p, [id]: { ...p[id], correcta: !p[id].correcta, adivinada: true } } : p)),
    [],
  )

  const deshacer = useCallback((id: string) => fijar(id, null), [fijar])
  const reiniciar = useCallback(() => setResultados({}), [])

  const valor = useMemo<Juego>(
    () => ({
      resultados,
      aciertos: Object.values(resultados).filter((r) => r.correcta).length,
      responder,
      revelar,
      alternar,
      deshacer,
      reiniciar,
    }),
    [resultados, responder, revelar, alternar, deshacer, reiniciar],
  )

  return <JuegoContext.Provider value={valor}>{children}</JuegoContext.Provider>
}

export function useJuego() {
  const juego = useContext(JuegoContext)
  if (!juego) throw new Error('useJuego debe usarse dentro de <JuegoProvider>')
  return juego
}
