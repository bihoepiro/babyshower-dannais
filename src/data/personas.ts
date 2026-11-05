/**
 * ─────────────────────────────────────────────────────────────
 *  DICCIONARIO DE NOMBRES Y ALIAS
 * ─────────────────────────────────────────────────────────────
 *  La clave es el nombre del archivo en `fotos/`, sin extensión
 *  (no importan tildes ni mayúsculas: Victor = Víctor).
 *
 *    nombre  (opcional) cómo se muestra al revelar.
 *            Si no se pone, se usa el nombre del archivo.
 *    alias   otras respuestas válidas para esa persona:
 *            nombre completo, apodos, variantes.
 *
 *  NO hace falta escribir aquí lo que el juego ya acepta solo:
 *    · mayúsculas, tildes y espacios extra        victor, VÍCTOR
 *    · el nombre completo de un diminutivo        Rodrigo → Rodri, Jimena → Jime
 *    · el diminutivo de un nombre completo         Vale → Valeria
 *    · ortografías que suenan igual                Ximena = Jimena, Jaky = Jacky
 *    · un error de tipeo en nombres largos         Rodirgo, Valria
 *
 *  Solo agrega lo que NO se parece al nombre del archivo:
 *  apodos (Vic), nombres distintos, segundos nombres…
 *
 *  Si un alias coincide con el de otra persona, el juego no lo
 *  aceptará para ninguna de las dos. `npm run fotos` lo avisa.
 */

export interface Persona {
  nombre?: string
  alias?: string[]
}

export const PERSONAS: Record<string, Persona> = {
  Adrian: { alias: [] },
  Biho: { alias: [] },
  Clau: { alias: [] },
  Dani: { alias: [] },
  David: { alias: [] },
  Jacky: { alias: [] },
  Jime: { alias: ['Jimena', 'Ximena'] },
  Jose: { alias: [] },
  Mauricio: { alias: [] },
  Rodri: { alias: ['Rodrigo'] },
  Vale: { alias: ['Valeria'] },
  Vane: { alias: [] },
  Victor: { alias: ['Vic'] },

  // Aún no hay foto con este nombre: queda listo para cuando se agregue.
  Glovio: { alias: ['Bionda'] },
}
