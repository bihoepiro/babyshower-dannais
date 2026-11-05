import type { CSSProperties, ReactNode } from 'react'

/** Marco de foto instantánea con esquineros, al estilo de un álbum antiguo. */
export function Polaroid({
  children,
  pie,
  className = '',
  giro = 0,
  style,
}: {
  children: ReactNode
  pie?: ReactNode
  className?: string
  /** Rotación en grados. */
  giro?: number
  style?: CSSProperties
}) {
  return (
    <figure className={`polaroid ${className}`} style={{ ...style, rotate: `${giro}deg` }}>
      <div className="polaroid__foto">
        {children}
        <span className="esquinero esquinero--si" aria-hidden="true" />
        <span className="esquinero esquinero--sd" aria-hidden="true" />
        <span className="esquinero esquinero--ii" aria-hidden="true" />
        <span className="esquinero esquinero--id" aria-hidden="true" />
      </div>
      {pie !== undefined && <figcaption className="polaroid__pie">{pie}</figcaption>}
    </figure>
  )
}
