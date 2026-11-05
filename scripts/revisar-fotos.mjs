// Revisa la carpeta fotos/ y avisa de cualquier cosa que convenga corregir antes del evento.
// Uso: npm run fotos
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, extname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const carpeta = join(raiz, 'fotos')
const SOPORTADAS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']
const MB = 1024 * 1024

const config = readFileSync(join(raiz, 'src/data/config.ts'), 'utf8')
const lista = (nombre) => {
  const bloque = config.match(new RegExp(`export const ${nombre}[^=]*=\\s*\\[([^\\]]*)\\]`))
  return bloque ? [...bloque[1].matchAll(/'([^']+)'/g)].map((m) => m[1]) : []
}
const orden = lista('ORDEN')
const excluidas = lista('EXCLUIR')
const fotoMama = config.match(/export const FOTO_MAMA\s*=\s*'([^']*)'/)?.[1]

const normalizar = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const fotos = []
const problemas = []
const avisos = []

for (const archivo of readdirSync(carpeta).sort()) {
  const ruta = join(carpeta, archivo)
  if (!statSync(ruta).isFile() || archivo.startsWith('.')) continue
  const ext = extname(archivo)
  const id = archivo.slice(0, -ext.length)

  if (!SOPORTADAS.includes(ext.toLowerCase())) {
    problemas.push(`${archivo}: formato ${ext || '(sin extensión)'} no se ve en navegadores. Conviértelo a .jpg o .png.`)
    continue
  }
  if (!SOPORTADAS.includes(ext)) {
    // El patrón de Vite acepta .jpg y .JPG, pero no mezclas como .Jpg
    if (ext !== ext.toUpperCase()) problemas.push(`${archivo}: renombra la extensión a ${ext.toLowerCase()}.`)
  }
  if (/\d/.test(id)) avisos.push(`${archivo}: el nombre tiene números; ¿es realmente el nombre de la persona?`)
  if (/[_-]/.test(id)) avisos.push(`${archivo}: se mostrará como "${id.replace(/[_-]+/g, ' ')}".`)
  if (id.trim().length < 2) problemas.push(`${archivo}: nombre demasiado corto.`)
  if (statSync(ruta).size > 4 * MB) avisos.push(`${archivo}: pesa ${(statSync(ruta).size / MB).toFixed(1)} MB; podría tardar en cargar.`)
  fotos.push({ archivo, id })
}

const vistos = new Map()
for (const { archivo, id } of fotos) {
  const clave = normalizar(id)
  if (vistos.has(clave)) problemas.push(`${archivo} y ${vistos.get(clave)} parecen ser la misma persona.`)
  else vistos.set(clave, archivo)
}

// Diccionario de alias y la misma lógica de validación que usa el juego.
let PERSONAS = null
let esCorrecta = null
try {
  ;({ PERSONAS } = await import(pathToFileURL(join(raiz, 'src/data/personas.ts')).href))
  ;({ esCorrecta } = await import(pathToFileURL(join(raiz, 'src/game/coincidencia.ts')).href))
} catch {
  avisos.push('No se pudieron revisar los alias (requiere Node 22.18 o superior). El juego funciona igual.')
}
const fichaDe = (id) => {
  const clave = PERSONAS && Object.keys(PERSONAS).find((k) => normalizar(k) === normalizar(id))
  return clave ? PERSONAS[clave] : {}
}

const esMama = (f) => fotoMama && normalizar(f.id) === normalizar(fotoMama)
const mama = fotos.find(esMama)
const enJuego = fotos.filter((f) => !excluidas.includes(f.id) && !esMama(f))
const nuevas = enJuego.filter((f) => !orden.includes(f.id))
const faltantes = orden.filter((id) => !fotos.some((f) => f.id === id))

console.log(`\n🍼  Fotos en el juego: ${enJuego.length}\n`)
const posicion = (id) => (orden.includes(id) ? orden.indexOf(id) : Infinity)
enJuego
  .sort((a, b) => posicion(a.id) - posicion(b.id) || a.id.localeCompare(b.id, 'es'))
  .forEach((f, i) => {
    const alias = fichaDe(f.id).alias ?? []
    console.log(
      `  ${String(i + 1).padStart(2)}. ${f.id.padEnd(12)} ${f.archivo.padEnd(16)} ${alias.length ? `alias: ${alias.join(', ')}` : ''}${orden.includes(f.id) ? '' : '   ← nueva (va al final)'}`,
    )
  })

console.log(
  mama
    ? `
💙 Foto sorpresa de mamá (fuera de las rondas): ${mama.archivo}`
    : `
⚠️  No hay foto de mamá (${fotoMama}.jpg): la escena sorpresa no aparecerá.`,
)

if (esCorrecta) {
  const bebes = enJuego.map((f) => ({
    id: f.id,
    nombre: fichaDe(f.id).nombre ?? f.id.replace(/[_-]+/g, ' ').trim(),
    foto: '',
    alias: fichaDe(f.id).alias ?? [],
  }))
  for (const b of bebes) {
    for (const forma of [b.nombre, ...b.alias]) {
      if (!esCorrecta(forma, b, bebes)) problemas.push(`«${forma}» no se aceptará para ${b.id}: se confunde con otra persona del juego.`)
    }
  }
  const sinFoto = Object.keys(PERSONAS).filter((k) => !fotos.some((f) => normalizar(f.id) === normalizar(k)))
  if (sinFoto.length) console.log(`
📝 En personas.ts pero todavía sin foto: ${sinFoto.join(', ')}`)
}

if (nuevas.length) {
  console.log(`\n✨ Fotos nuevas que no están en ORDEN (src/data/config.ts): ${nuevas.map((f) => `'${f.id}'`).join(', ')}`)
  console.log('   Se mostrarán al final. Agrégalas a ORDEN si quieres otra posición.')
}
if (faltantes.length) console.log(`\n⚠️  En ORDEN pero sin foto: ${faltantes.join(', ')}`)
if (avisos.length) console.log(`\n⚠️  Revisar:\n${avisos.map((a) => `   · ${a}`).join('\n')}`)
if (problemas.length) {
  console.log(`\n❌ Corregir antes del evento:\n${problemas.map((p) => `   · ${p}`).join('\n')}`)
  process.exitCode = 1
}
if (!nuevas.length && !faltantes.length && !avisos.length && !problemas.length) console.log('\n✅ Todo en orden.')
console.log('')
