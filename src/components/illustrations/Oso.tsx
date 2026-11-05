/** Osito de peluche sentado, ilustrado en acuarela. */
export function Oso({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 240" role="img" aria-label="Osito de peluche">
      <ellipse cx="110" cy="229" rx="80" ry="7" fill="#b6977a" opacity="0.2" filter="url(#difuminar)" />
      <g filter="url(#acuarela-pelaje)">
        {/* orejas */}
        <circle cx="61" cy="42" r="21" fill="url(#oso-pelaje)" />
        <circle cx="159" cy="42" r="21" fill="url(#oso-pelaje)" />
        <circle cx="63" cy="45" r="10.5" fill="url(#oso-claro)" opacity="0.85" />
        <circle cx="157" cy="45" r="10.5" fill="url(#oso-claro)" opacity="0.85" />

        {/* cuerpo y pancita */}
        <path d="M110 106 C70 106 52 140 50 172 C48 206 72 222 110 222 C148 222 172 206 170 172 C168 140 150 106 110 106 Z" fill="url(#oso-pelaje)" />
        <ellipse cx="110" cy="172" rx="33" ry="36" fill="url(#oso-claro)" opacity="0.8" />

        {/* bracitos */}
        <ellipse cx="58" cy="160" rx="17" ry="31" transform="rotate(20 58 160)" fill="url(#oso-pelaje-oscuro)" />
        <ellipse cx="162" cy="160" rx="17" ry="31" transform="rotate(-20 162 160)" fill="url(#oso-pelaje-oscuro)" />

        {/* piernas con patitas */}
        <ellipse cx="66" cy="207" rx="32" ry="22" transform="rotate(-10 66 207)" fill="url(#oso-pelaje)" />
        <ellipse cx="154" cy="207" rx="32" ry="22" transform="rotate(10 154 207)" fill="url(#oso-pelaje)" />
        <ellipse cx="54" cy="210" rx="15" ry="15.5" fill="url(#oso-claro)" opacity="0.9" />
        <ellipse cx="166" cy="210" rx="15" ry="15.5" fill="url(#oso-claro)" opacity="0.9" />
        <g fill="#7b5236" opacity="0.62">
          <ellipse cx="54" cy="214" rx="7.5" ry="6.5" />
          <circle cx="46.5" cy="204" r="3" />
          <circle cx="54" cy="201" r="3" />
          <circle cx="61.5" cy="204" r="3" />
          <ellipse cx="166" cy="214" rx="7.5" ry="6.5" />
          <circle cx="158.5" cy="204" r="3" />
          <circle cx="166" cy="201" r="3" />
          <circle cx="173.5" cy="204" r="3" />
        </g>

        {/* cabeza */}
        <ellipse cx="110" cy="80" rx="56" ry="50" fill="url(#oso-pelaje)" />
        <ellipse cx="110" cy="100" rx="22" ry="16" fill="url(#oso-claro)" />

        {/* trazos de pelaje */}
        <g stroke="#6f4a30" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.28">
          <path d="M78 44 q4 4 2 9" />
          <path d="M132 40 q-3 5 0 9" />
          <path d="M70 68 q3 3 1 7" />
          <path d="M150 66 q-3 4 -1 8" />
          <path d="M80 130 q4 5 1 10" />
          <path d="M142 128 q-3 5 0 10" />
          <path d="M64 186 q4 3 3 8" />
          <path d="M156 186 q-4 3 -3 8" />
        </g>
      </g>

      {/* carita: sin filtro de pelaje para que se lea nítida */}
      <g filter="url(#acuarela)">
        <path d="M101 92 Q110 86 119 92 Q117 99 110 101 Q103 99 101 92 Z" fill="#4a3022" />
        <ellipse cx="76" cy="98" rx="10" ry="6" fill="#ee9d92" opacity="0.4" />
        <ellipse cx="144" cy="98" rx="10" ry="6" fill="#ee9d92" opacity="0.4" />
      </g>
      <path
        d="M110 101 L110 105 M103.5 105 Q107 109 110 105 Q113 109 116.5 105"
        stroke="#4a3022"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      <circle cx="88" cy="79" r="4.3" fill="#2f2019" />
      <circle cx="132" cy="79" r="4.3" fill="#2f2019" />
      <circle cx="89.5" cy="77.4" r="1.3" fill="#fff" opacity="0.9" />
      <circle cx="133.5" cy="77.4" r="1.3" fill="#fff" opacity="0.9" />
    </svg>
  )
}
