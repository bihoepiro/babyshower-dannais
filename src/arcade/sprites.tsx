import { memo } from 'react'

/**
 * Sprites pixel art originales. Cada sprite es una matriz de caracteres;
 * cada carácter es un color de la paleta y '.' es transparente.
 */
export interface DatosSprite {
  filas: string[]
  paleta: Record<string, string>
}

const K = '#140c2e' // contorno

export const BEBE: DatosSprite = {
  paleta: { k: K, s: '#ffcf9f', S: '#f1a676', h: '#ff8a1f', H: '#d6600d', w: '#ffffff', e: '#1b2a7a', c: '#ff8fa3', p: '#ff3fa4', b: '#35c6ff', d: '#f7f7ff', D: '#bfcaff' },
  filas: [
    '.......hh.......',
    '......hHh.......',
    '....kkkkkkkk....',
    '...kssssssssk...',
    '..kssssssssssk..',
    '.kssssssssssssk.',
    '.ksswesssswessk.',
    '.ksseesssseessk.',
    '.kscssppppsscsk.',
    '.ksssspbbpssssk.',
    '..kssssbbssssk..',
    '...kksssssskk...',
    '....kkSSSSkk....',
    '...ksssssssssk..',
    '..kskssssssksk..',
    '..kskssssssksk..',
    '..kskddddddksk..',
    '...kkdDDDDdkk...',
    '....kddddddk....',
    '...kssk..kssk...',
    '...kkkk..kkkk...',
  ],
}

export const INGENIERO: DatosSprite = {
  paleta: { k: K, s: '#ffcf9f', h: '#4a2a1a', g: '#35e0ff', m: '#ff3fa4', G: '#22c55e', D: '#14803e', l: '#d9e2ff', L: '#4f5fa8', y: '#ffd23f', P: '#2a3590' },
  filas: [
    '....kkkkkkkk....',
    '...khhhhhhhhk...',
    '..khhhhhhhhhhk..',
    '.mkhsssssssshkm.',
    '.mksgggkkgggskm.',
    '.mksgggssgggskm.',
    '..kssssssssssk..',
    '..ksssskkssssk..',
    '...kssssssssk...',
    '....kkkkkkkk....',
    '..kGGGGGGGGGGk..',
    '.kGGGGDGGDGGGGk.',
    '.kGllllllllllGk.',
    '.kGlLyyLLyyLlGk.',
    '.kslLLyyyyLLlsk.',
    '.kslLLLLLLLLlsk.',
    '..kllllllllllk..',
    '...kPPPPPPPPk...',
    '...kPPPkkPPPk...',
    '...kkkk..kkkk...',
  ],
}

export const BIBERON: DatosSprite = {
  paleta: { k: K, y: '#ffb23f', p: '#ff3fa4', w: '#ffffff', b: '#35c6ff', m: '#fff1c4' },
  filas: [
    '...kkk...',
    '..kyyyk..',
    '..kyyyk..',
    '.kkpppkk.',
    '.kpppppk.',
    '.kkkkkkk.',
    '.kwwwwwk.',
    '.kwbwwwk.',
    '.kwwwwwk.',
    '.kwbwwwk.',
    '.kmmmmmk.',
    '.kmmmmmk.',
    '.kmmmmmk.',
    '.kkkkkkk.',
  ],
}

export const COPO: DatosSprite = {
  paleta: { c: '#35e0ff', w: '#ffffff' },
  filas: [
    '.....c.....',
    '..c..c..c..',
    '...c.c.c...',
    '....ccc....',
    '.c..cwc..c.',
    'ccccwwwcccc',
    '.c..cwc..c.',
    '....ccc....',
    '...c.c.c...',
    '..c..c..c..',
    '.....c.....',
  ],
}

export const BASE_DATOS: DatosSprite = {
  paleta: { k: K, l: '#7cf0a4', g: '#22c55e', G: '#14803e', y: '#ffd23f' },
  filas: [
    '..kkkkkk..',
    '.kllllllk.',
    'kllllllllk',
    'kGllllllGk',
    'kgGGGGGGgk',
    'kggggggyyk',
    'kggggggggk',
    'kgGGGGGGgk',
    'kggggggyyk',
    'kggggggggk',
    '.kggggggk.',
    '..kkkkkk..',
  ],
}

export const PANAL: DatosSprite = {
  paleta: { k: K, w: '#ffffff', b: '#35c6ff', B: '#bfe9ff' },
  filas: [
    'kkkkkkkkkkkk',
    'kbwwwwwwwwbk',
    'kbwwwwwwwwbk',
    '.kwwBwwBwwk.',
    '..kwwwwwwk..',
    '...kwwwwk...',
    '....kwwk....',
    '.....kk.....',
  ],
}

export const CHUPON: DatosSprite = {
  paleta: { y: '#ffd23f', p: '#ff3fa4', w: '#ffffff' },
  filas: [
    '...yyy...',
    '..y...y..',
    '..y...y..',
    '...yyy...',
    '.ppppppp.',
    'ppwpppwpp',
    '.ppppppp.',
    '...pwp...',
    '....p....',
  ],
}

export const SONAJERO: DatosSprite = {
  paleta: { o: '#ff6b1a', y: '#ffd23f', b: '#35c6ff' },
  filas: [
    '..ooo..',
    '.oyooo.',
    'ooooyoo',
    'oyooooo',
    '.ooooo.',
    '..ooo..',
    '...b...',
    '...b...',
    '...b...',
    '...b...',
    '..bbb..',
    '..bbb..',
  ],
}

export const TERMINAL: DatosSprite = {
  paleta: { k: K, m: '#ff3fa4', r: '#ff5a4e', y: '#ffd23f', g: '#22c55e', n: '#0d1450' },
  filas: [
    'kkkkkkkkkkkkkk',
    'kmmmmmmmmmrygk',
    'kkkkkkkkkkkkkk',
    'knnnnnnnnnnnnk',
    'knggngggnnnnnk',
    'knnngggggnnnnk',
    'knggggnggnnnnk',
    'kngyynnnnnnnnk',
    'knnnnnnnnnnnnk',
    'kkkkkkkkkkkkkk',
  ],
}

export const CORONA: DatosSprite = {
  paleta: { y: '#ffd23f', o: '#ff9d1f', r: '#ff3fa4' },
  filas: [
    'y...y...y',
    'yy.yyy.yy',
    'yyyyyyyyy',
    'yryyryyry',
    'yyyyyyyyy',
    'ooooooooo',
  ],
}

export const CORAZON: DatosSprite = {
  paleta: { r: '#ff3fa4' },
  filas: ['.rr.rr.', 'rrrrrrr', 'rrrrrrr', '.rrrrr.', '..rrr..', '...r...'],
}

/** Dibuja un sprite como SVG nítido, uniendo píxeles contiguos del mismo color. */
export const Sprite = memo(function Sprite({
  sprite,
  className,
  titulo,
  paleta,
}: {
  sprite: DatosSprite
  className?: string
  titulo?: string
  /** Reemplaza colores de la paleta (por ejemplo, un bebé de pelo azul). */
  paleta?: Record<string, string>
}) {
  const colores = { ...sprite.paleta, ...paleta }
  const ancho = Math.max(...sprite.filas.map((f) => f.length))
  const rects: { x: number; y: number; w: number; c: string }[] = []
  sprite.filas.forEach((fila, y) => {
    let x = 0
    while (x < fila.length) {
      const ch = fila[x]
      let fin = x + 1
      while (fin < fila.length && fila[fin] === ch) fin++
      if (ch !== '.' && colores[ch]) rects.push({ x, y, w: fin - x, c: colores[ch] })
      x = fin
    }
  })
  return (
    <svg
      className={className}
      viewBox={`0 0 ${ancho} ${sprite.filas.length}`}
      shapeRendering="crispEdges"
      style={{ aspectRatio: `${ancho} / ${sprite.filas.length}` }}
      role={titulo ? 'img' : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
    >
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.c} />
      ))}
    </svg>
  )
})
