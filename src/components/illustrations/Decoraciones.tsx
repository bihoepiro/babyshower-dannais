type Tono = 'celeste' | 'palido' | 'crema'

/** Globo de acuarela con su cordel. `cordel` = largo del hilo en unidades del viewBox. */
export function Globo({ className, tono = 'celeste', cordel = 110 }: { className?: string; tono?: Tono; cordel?: number }) {
  const alto = 112 + cordel
  const hilo = `M50 107 C45 ${112 + cordel * 0.25} 57 ${112 + cordel * 0.45} 50 ${112 + cordel * 0.65} C44 ${112 + cordel * 0.8} 54 ${112 + cordel * 0.9} 49 ${alto - 1}`
  return (
    <svg className={className} viewBox={`0 0 100 ${alto}`} aria-hidden="true">
      <path d={hilo} stroke="#9fb6dc" strokeWidth="1.3" fill="none" opacity="0.85" />
      <g filter="url(#acuarela)">
        <path
          d="M50 6 C77 6 92 30 90 56 C88 82 68 100 50 102 C32 100 12 82 10 56 C8 30 23 6 50 6 Z"
          fill={`url(#globo-${tono})`}
        />
        <path d="M45 101 L55 101 L52 108 L48 108 Z" fill={tono === 'crema' ? '#d3b78e' : '#86a6d6'} />
      </g>
      <ellipse cx="34" cy="34" rx="9" ry="15" transform="rotate(25 34 34)" fill="#fff" opacity="0.45" filter="url(#difuminar)" />
    </svg>
  )
}

export function Nube({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 96" aria-hidden="true">
      <path
        filter="url(#acuarela-nube)"
        fill="url(#nube)"
        d="M34 86 C14 86 8 68 20 60 C14 44 32 32 48 40 C52 20 80 12 96 28 C106 14 134 14 142 34 C160 28 180 40 176 58 C192 62 192 84 172 86 Z"
      />
    </svg>
  )
}

export function Estrella({ className, color = '#d8c08e' }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z" fill={color} />
    </svg>
  )
}

/** Separador fino con una estrellita al centro, como en las invitaciones clásicas. */
export function Separador({ className }: { className?: string }) {
  return (
    <div className={`separador ${className ?? ''}`} aria-hidden="true">
      <span />
      <Estrella className="separador__estrella" color="#a9c1e6" />
      <span />
    </div>
  )
}
