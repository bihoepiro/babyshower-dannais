/**
 * Filtros y degradados compartidos que dan a los SVG un acabado de acuarela:
 * bordes irregulares, granulado del pigmento y bordes más oscuros donde se acumula el agua.
 */
function FiltroAcuarela({
  id,
  frecuencia,
  escala,
  semilla,
  borde = 0.55,
  grano = 0.86,
}: {
  id: string
  frecuencia: string
  escala: number
  semilla: number
  /** Intensidad del borde oscuro donde se acumula el pigmento. */
  borde?: number
  /** Tono del granulado (1 = sin granulado). */
  grano?: number
}) {
  return (
    <filter id={id} x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency={frecuencia} numOctaves={3} seed={semilla} result="ondas" />
      <feDisplacementMap in="SourceGraphic" in2="ondas" scale={escala} xChannelSelector="R" yChannelSelector="G" result="forma" />
      <feGaussianBlur in="forma" stdDeviation="0.5" result="suave" />
      <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves={2} seed={semilla + 4} result="grano" />
      <feColorMatrix
        in="grano"
        type="matrix"
        values={`0 0 0 0 ${grano}  0 0 0 0 ${grano}  0 0 0 0 ${grano}  0 0 0 0 1`}
        result="granoClaro"
      />
      <feBlend in="suave" in2="granoClaro" mode="multiply" result="pigmento" />
      <feComposite in="pigmento" in2="suave" operator="in" result="pigmentoRecortado" />
      <feMorphology in="suave" operator="erode" radius="1.6" result="interior" />
      <feGaussianBlur in="interior" stdDeviation="2.2" result="interiorDifuso" />
      <feComposite in="suave" in2="interiorDifuso" operator="out" result="borde" />
      <feColorMatrix
        in="borde"
        type="matrix"
        values={`0.72 0 0 0 0  0 0.72 0 0 0  0 0 0.76 0 0  0 0 0 ${borde} 0`}
        result="bordeOscuro"
      />
      <feMerge>
        <feMergeNode in="pigmentoRecortado" />
        <feMergeNode in="bordeOscuro" />
      </feMerge>
    </filter>
  )
}

export function AcuarelaDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <FiltroAcuarela id="acuarela" frecuencia="0.03" escala={6} semilla={3} />
        <FiltroAcuarela id="acuarela-pelaje" frecuencia="0.09" escala={5} semilla={11} />
        <FiltroAcuarela id="acuarela-nube" frecuencia="0.025" escala={8} semilla={5} borde={0.2} grano={0.985} />
        <filter id="difuminar" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>

        <radialGradient id="oso-pelaje" cx="42%" cy="32%" r="78%">
          <stop offset="0" stopColor="#c99c72" />
          <stop offset="0.55" stopColor="#a8784f" />
          <stop offset="1" stopColor="#80553a" />
        </radialGradient>
        <radialGradient id="oso-pelaje-oscuro" cx="40%" cy="30%" r="80%">
          <stop offset="0" stopColor="#b88a60" />
          <stop offset="1" stopColor="#7a5034" />
        </radialGradient>
        <radialGradient id="oso-claro" cx="50%" cy="40%" r="70%">
          <stop offset="0" stopColor="#f3e2c8" />
          <stop offset="1" stopColor="#d6b28b" />
        </radialGradient>

        <radialGradient id="globo-celeste" cx="36%" cy="30%" r="80%">
          <stop offset="0" stopColor="#dbe8f8" />
          <stop offset="0.45" stopColor="#a9c4e9" />
          <stop offset="1" stopColor="#7c9fd4" />
        </radialGradient>
        <radialGradient id="globo-palido" cx="36%" cy="30%" r="80%">
          <stop offset="0" stopColor="#eef4fb" />
          <stop offset="0.5" stopColor="#c9dbf2" />
          <stop offset="1" stopColor="#9fbbe3" />
        </radialGradient>
        <radialGradient id="globo-crema" cx="36%" cy="30%" r="80%">
          <stop offset="0" stopColor="#fbf4e8" />
          <stop offset="0.5" stopColor="#efe0c6" />
          <stop offset="1" stopColor="#d8bf98" />
        </radialGradient>

        <linearGradient id="nube" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.65" stopColor="#f7f9fd" />
          <stop offset="1" stopColor="#e6eef9" />
        </linearGradient>
      </defs>
    </svg>
  )
}
