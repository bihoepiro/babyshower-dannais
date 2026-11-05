/**
 * Las 15 preguntas del juego, tal cual fueron entregadas
 * (las 10, 13 y 15 se reescribieron después a pedido del equipo).
 * El texto entre `comillas invertidas` se muestra como código.
 * `numero` es el número original de la pregunta; el orden de juego
 * alterna Data Engineer y Baby Engineer y deja el bonus al final.
 */

export type Letra = 'A' | 'B' | 'C'
export type Equipo = 'data' | 'baby' | 'bonus'

export interface Pregunta {
  numero: number
  equipo: Equipo
  titulo: string
  /** Texto previo a la pregunta (solo el bonus). */
  intro?: string
  enunciado: string
  opciones: Record<Letra, string>
  correcta: Letra
  explicacion?: string
}

const DATA: Pregunta[] = [
  {
    numero: 1,
    equipo: 'data',
    titulo: 'El viaje del dato',
    enunciado: 'En nuestro flujo de datos, ¿cuál es el orden correcto de las capas?',
    opciones: {
      A: 'Domain → Landing → Curated',
      B: 'Landing → Curated → Domain',
      C: 'Curated → Landing → Domain',
    },
    correcta: 'B',
    explicacion: 'En nuestro repositorio, las capas siguen este orden.',
  },
  {
    numero: 2,
    equipo: 'data',
    titulo: 'Prohibido tocar PROD',
    enunciado: 'Si ejecutamos `SP_CLONE_ENVIROMENT` intentando refrescar el ambiente PROD, ¿qué pasa?',
    opciones: {
      A: 'Hace un clon de PROD sobre sí mismo.',
      B: 'Pide aprobación del DBA por correo.',
      C: 'Responde “Violation process” y no hace nada.',
    },
    correcta: 'C',
    explicacion: 'El procedimiento bloquea el refresh de PROD.',
  },
  {
    numero: 3,
    equipo: 'data',
    titulo: 'Nombre de ambiente',
    enunciado: '¿Cuál es la base donde viven los procedimientos del ETL (`ETL_OBJECTS`)?',
    opciones: {
      A: '`ENT_PROD_COMMON_DB`',
      B: '`ENT_PROD_SUPERETL_DB`',
      C: '`ENT_PROD_BELCORP_DB`',
    },
    correcta: 'A',
    explicacion: 'Los procedimientos viven en `COMMON_DB.ETL_OBJECTS`.',
  },
  {
    numero: 4,
    equipo: 'data',
    titulo: 'Señal de “ya terminé”',
    enunciado: '¿Qué archivo disparador esperamos para saber que la carga está lista?',
    opciones: {
      A: '`_SUCCESS.EVENT`',
      B: '`LISTO_YA.TXT`',
      C: '`FIN_DE_FIESTA.CSV`',
    },
    correcta: 'A',
    explicacion: '`_SUCCESS.EVENT` funciona como archivo disparador.',
  },
  {
    numero: 5,
    equipo: 'data',
    titulo: 'El chismoso del pipeline',
    enunciado: '¿Para qué sirve `SP_LOG_TRACER`?',
    opciones: {
      A: 'Para borrar tablas antiguas.',
      B: 'Para registrar eventos, estados y mensajes de cada proceso.',
      C: 'Para comprimir archivos en GZIP.',
    },
    correcta: 'B',
    explicacion: 'Registra lo que ocurre durante los procesos.',
  },
  {
    numero: 6,
    equipo: 'data',
    titulo: 'Copia y pega — versión Snowflake',
    enunciado:
      'Para crear un ambiente de pruebas con los datos de PROD, nuestro `SP_CLONE_ENVIROMENT` usa un comando de Snowflake. ¿Cuál?',
    opciones: {
      A: '`CREATE DATABASE ... CLONE`',
      B: '`CREATE DATABASE ... COPY`',
      C: '`CREATE DATABASE ... REPLICATE`',
    },
    correcta: 'A',
    explicacion: 'Snowflake permite clonar bases de datos con `CLONE`, sin duplicar físicamente todos los datos.',
  },
  {
    numero: 7,
    equipo: 'data',
    titulo: 'Versión de nacimiento',
    enunciado: 'En la carpeta `Migrations`, ¿cómo se nombran las versiones de despliegue?',
    opciones: {
      A: 'Con nombres de personajes de Disney.',
      B: 'Con numeración tipo año.semana.revisión, como `2022.13.1`.',
      C: 'Con la fecha de cumpleaños del desarrollador.',
    },
    correcta: 'B',
    explicacion: 'Se utilizan versiones como `2022.12.1` y `2022.13.2`.',
  },
]

const BABY: Pregunta[] = [
  {
    numero: 8,
    equipo: 'baby',
    titulo: 'Los huesitos',
    enunciado: 'Un bebé nace con aproximadamente cuántos huesos, frente a los 206 de un adulto?',
    opciones: { A: '100', B: '300', C: '500' },
    correcta: 'B',
    explicacion: 'Los bebés nacen con alrededor de 300 huesos, varios se fusionan al crecer.',
  },
  {
    numero: 9,
    equipo: 'baby',
    titulo: 'Lágrimas con retraso',
    enunciado: '¿A qué edad suelen aparecer las lágrimas visibles al llorar?',
    opciones: {
      A: 'Siempre desde el primer día.',
      B: 'Durante las primeras semanas de vida.',
      C: 'Recién al cumplir un año.',
    },
    correcta: 'B',
    explicacion: 'Suelen aparecer durante las primeras semanas, aunque varía entre bebés.',
  },
  {
    numero: 10,
    equipo: 'baby',
    titulo: 'Pancita mini',
    enunciado: 'En su primer día de vida, ¿de qué tamaño es aproximadamente el estómago de un recién nacido?',
    opciones: { A: 'Como un huevo.', B: 'Como una naranja.', C: 'Como una cereza.' },
    correcta: 'C',
    explicacion:
      'El primer día le caben apenas unos 5 a 7 ml: por eso los recién nacidos comen poquito… ¡y muy seguido!',
  },
  {
    numero: 11,
    equipo: 'baby',
    titulo: 'Sentido favorito',
    enunciado: '¿Qué sentido está especialmente desarrollado en un bebé al nacer?',
    opciones: {
      A: 'La vista a color.',
      B: 'El olfato, que le ayuda a reconocer a su mamá.',
      C: 'El gusto por el brócoli.',
    },
    correcta: 'B',
    explicacion: 'El olfato ayuda al recién nacido a reconocer a su madre.',
  },
  {
    numero: 12,
    equipo: 'baby',
    titulo: 'Tradición de baby shower',
    enunciado: '¿Qué juego consiste en calcular el tamaño de la pancita de la futura mamá usando cinta o lana?',
    opciones: {
      A: 'Baby Bingo.',
      B: 'Adivina el tamaño de la pancita.',
      C: 'Feeding the Baby.',
    },
    correcta: 'B',
  },
  {
    numero: 13,
    equipo: 'baby',
    titulo: 'Tiempo de sueño',
    enunciado: '¿Cuántas horas duerme al día un recién nacido, aproximadamente?',
    opciones: { A: '9 a 11 horas.', B: '11 a 13 horas.', C: '14 a 17 horas.' },
    correcta: 'C',
    explicacion: 'Duermen muchas horas, pero en periodos cortos.',
  },
  {
    numero: 14,
    equipo: 'baby',
    titulo: 'Primera sonrisa',
    enunciado: '¿Cuándo suelen aparecer las primeras sonrisas sociales, como respuesta a otra persona?',
    opciones: {
      A: 'Alrededor de las 6 a 8 semanas.',
      B: 'A los 6 meses.',
      C: 'Al año.',
    },
    correcta: 'A',
    explicacion: 'La sonrisa social suele aparecer alrededor de los dos meses.',
  },
]

const BONUS: Pregunta = {
  numero: 15,
  equipo: 'bonus',
  titulo: '¿Quién será el padrino Belcorp de Noah?',
  intro:
    'Noah aún no llega y ya pasó por el proceso de selección más exigente de Belcorp: buscarle padrino. Hubo entrevistas, prueba técnica y hasta un pipeline de candidatos…',
  enunciado: '¿Quién se quedó con el puesto de padrino oficial de Belcorp?',
  opciones: {
    A: 'Venkat Raghavan Gopalan',
    B: 'El Data Engineer que prometió cambiar pañales “en batch, cada 3 horas”.',
    C: '`SP_CLONE_ENVIROMENT`, para tener un Noah de respaldo en DEV.',
  },
  correcta: 'A',
  explicacion: '¡Nuestro CTO será el padrino Belcorp de Noah! Aprobado en PROD y sin rollback. 🎉',
}

/** Orden de juego: Data, Baby, Data, Baby… y el bonus al final. */
export const PREGUNTAS: Pregunta[] = [...DATA.flatMap((d, i) => [d, BABY[i]]), BONUS]

export const LETRAS: Letra[] = ['A', 'B', 'C']

export const PUNTOS = { normal: 100, bonus: 300 }
export const PUNTAJE_MAXIMO = PREGUNTAS.reduce((s, p) => s + (p.equipo === 'bonus' ? PUNTOS.bonus : PUNTOS.normal), 0)
