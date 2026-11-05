import type { ReactNode } from 'react'
import { Oso } from './illustrations/Oso'

/**
 * Nubecita de diálogo: Noah le habla directamente a los invitados.
 * Con `conNoah` aparece un osito pequeño a su lado; sin él, la colita
 * apunta hacia el osito que ya está en la escena (`colita`).
 */
export function Bocadillo({
  children,
  conNoah = true,
  colita = 'izquierda',
  className = '',
}: {
  children: ReactNode
  conNoah?: boolean
  colita?: 'izquierda' | 'derecha'
  className?: string
}) {
  return (
    <div className={`bocadillo bocadillo--colita-${colita} ${className}`}>
      {conNoah && (
        <span className="bocadillo__noah balanceo" aria-hidden="true">
          <Oso />
        </span>
      )}
      <p className="bocadillo__nube">
        <span className="bocadillo__colita" aria-hidden="true">
          <i />
          <i />
        </span>
        {children}
      </p>
    </div>
  )
}
