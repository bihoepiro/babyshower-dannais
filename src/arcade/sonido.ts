/**
 * Sonido 100 % sintetizado con Web Audio: una melodía chiptune original y
 * efectos arcade. No hay archivos de audio. El contexto se crea al presionar
 * START (los navegadores bloquean el audio antes de un gesto del usuario).
 */

const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12)

// Melodía original en Do mayor, 8 compases de 16 semicorcheas (null = silencio).
const _ = null
const MELODIA: (number | null)[] = [
  72, _, 76, _, 79, _, 76, _, 84, _, 79, _, 76, _, 79, _,
  81, _, 79, _, 76, _, 72, _, 74, _, 76, _, 72, _, _, _,
  77, _, 81, _, 84, _, 81, _, 79, _, 77, _, 76, _, 77, _,
  79, _, 74, _, 71, _, 74, _, 79, _, 83, _, 86, _, _, _,
  84, _, 83, _, 84, _, 79, _, 76, _, 79, _, 84, _, 88, _,
  86, _, 84, _, 81, _, 76, _, 81, _, 84, _, 81, _, _, _,
  77, _, 76, _, 77, _, 81, _, 84, _, 81, _, 77, _, 81, _,
  79, _, _, _, 83, _, _, _, 86, _, 84, _, 83, _, 79, _,
]
// Acordes por compás: Do, La m, Fa, Sol (dos veces).
const BAJOS = [36, 45, 41, 43, 36, 45, 41, 43]
const TEMPO = 132
const PASO = 60 / TEMPO / 4

class Sonido {
  private ctx: AudioContext | null = null
  private maestro!: GainNode
  private musica!: GainNode
  private efectos!: GainNode
  private ruido!: AudioBuffer
  private temporizador = 0
  private paso = 0
  private siguienteTiempo = 0
  musicaActiva = true
  silenciado = false

  constructor() {
    try {
      const guardado = JSON.parse(localStorage.getItem('arcade-sonido') ?? '{}')
      this.musicaActiva = guardado.musica ?? true
      this.silenciado = guardado.silencio ?? false
    } catch {
      /* preferencias por defecto */
    }
  }

  private guardar() {
    try {
      localStorage.setItem('arcade-sonido', JSON.stringify({ musica: this.musicaActiva, silencio: this.silenciado }))
    } catch {
      /* sin almacenamiento */
    }
  }

  /** Llamar dentro de un clic o tecla. */
  despertar() {
    if (!this.ctx) {
      const Contexto = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!Contexto) return
      this.ctx = new Contexto()
      this.maestro = this.ctx.createGain()
      this.maestro.gain.value = this.silenciado ? 0 : 0.8
      this.maestro.connect(this.ctx.destination)
      this.musica = this.ctx.createGain()
      this.musica.gain.value = 0.55
      this.musica.connect(this.maestro)
      this.efectos = this.ctx.createGain()
      this.efectos.gain.value = 0.9
      this.efectos.connect(this.maestro)
      this.ruido = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.5, this.ctx.sampleRate)
      const datos = this.ruido.getChannelData(0)
      for (let i = 0; i < datos.length; i++) datos[i] = Math.random() * 2 - 1
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume()
  }

  private nota(
    frecuencia: number,
    inicio: number,
    duracion: number,
    { tipo = 'square' as OscillatorType, volumen = 0.15, destino = this.efectos, hasta }: {
      tipo?: OscillatorType
      volumen?: number
      destino?: GainNode
      hasta?: number
    } = {},
  ) {
    if (!this.ctx) return
    const osc = this.ctx.createOscillator()
    const env = this.ctx.createGain()
    osc.type = tipo
    osc.frequency.setValueAtTime(frecuencia, inicio)
    if (hasta) osc.frequency.exponentialRampToValueAtTime(hasta, inicio + duracion)
    env.gain.setValueAtTime(volumen, inicio)
    env.gain.exponentialRampToValueAtTime(0.0001, inicio + duracion)
    osc.connect(env).connect(destino)
    osc.start(inicio)
    osc.stop(inicio + duracion + 0.02)
  }

  private golpe(inicio: number, duracion: number, volumen: number, filtro: number, destino = this.musica) {
    if (!this.ctx) return
    const fuente = this.ctx.createBufferSource()
    fuente.buffer = this.ruido
    const pasoAlto = this.ctx.createBiquadFilter()
    pasoAlto.type = 'highpass'
    pasoAlto.frequency.value = filtro
    const env = this.ctx.createGain()
    env.gain.setValueAtTime(volumen, inicio)
    env.gain.exponentialRampToValueAtTime(0.0001, inicio + duracion)
    fuente.connect(pasoAlto).connect(env).connect(destino)
    fuente.start(inicio)
    fuente.stop(inicio + duracion)
  }

  private secuencia(notas: number[], separacion: number, opciones: Parameters<Sonido['nota']>[3] = {}, duracion = separacion * 1.4) {
    if (!this.ctx) return
    const t = this.ctx.currentTime + 0.01
    notas.forEach((n, i) => this.nota(midi(n), t + i * separacion, duracion, opciones))
  }

  // ── Efectos ──
  seleccionar() {
    if (!this.ctx) return
    this.nota(880, this.ctx.currentTime, 0.07, { volumen: 0.12, hasta: 1320 })
  }
  suspenso() {
    this.secuencia([67, 67, 67], 0.28, { volumen: 0.09, tipo: 'triangle' }, 0.12)
  }
  acierto() {
    this.secuencia([72, 76, 79, 84, 88], 0.07, { volumen: 0.14 })
  }
  error() {
    if (!this.ctx) return
    const t = this.ctx.currentTime
    this.nota(311, t, 0.22, { tipo: 'sawtooth', volumen: 0.12, hasta: 155 })
    this.nota(233, t + 0.24, 0.38, { tipo: 'sawtooth', volumen: 0.12, hasta: 82 })
  }
  moneda() {
    if (!this.ctx) return
    const t = this.ctx.currentTime
    this.nota(988, t, 0.07, { volumen: 0.12 })
    this.nota(1319, t + 0.07, 0.3, { volumen: 0.12 })
  }
  inicio() {
    this.secuencia([60, 64, 67, 72, 67, 72, 76, 79, 84], 0.055, { volumen: 0.12 })
  }
  bonus() {
    this.secuencia([72, 76, 79, 72, 76, 79, 84, 88, 91, 96], 0.075, { volumen: 0.12 })
  }
  victoria() {
    this.secuencia([72, 72, 72, 72, 68, 70, 72, 70, 72], 0.13, { volumen: 0.13 }, 0.2)
  }

  // ── Música ──
  private programar = () => {
    if (!this.ctx) return
    while (this.siguienteTiempo < this.ctx.currentTime + 0.15) {
      const t = this.siguienteTiempo
      const i = this.paso % MELODIA.length
      const enCompas = i % 16
      const nota = MELODIA[i]
      if (nota) this.nota(midi(nota), t, PASO * 1.7, { volumen: 0.055, destino: this.musica })
      if (enCompas % 2 === 0) {
        const raiz = BAJOS[Math.floor(i / 16)]
        this.nota(midi(enCompas % 4 === 0 ? raiz : raiz + 12), t, PASO * 1.8, {
          tipo: 'triangle',
          volumen: 0.16,
          destino: this.musica,
        })
        this.golpe(t, 0.03, 0.035, 7000)
      }
      if (enCompas === 0 || enCompas === 8) this.nota(150, t, 0.12, { tipo: 'sine', volumen: 0.25, destino: this.musica, hasta: 45 })
      if (enCompas === 4 || enCompas === 12) this.golpe(t, 0.12, 0.09, 1500)
      this.siguienteTiempo += PASO
      this.paso++
    }
  }

  iniciarMusica() {
    if (!this.ctx || !this.musicaActiva || this.temporizador) return
    this.paso = 0
    this.siguienteTiempo = this.ctx.currentTime + 0.1
    this.temporizador = window.setInterval(this.programar, 25)
  }

  detenerMusica() {
    window.clearInterval(this.temporizador)
    this.temporizador = 0
  }

  alternarMusica() {
    this.musicaActiva = !this.musicaActiva
    if (this.musicaActiva) this.iniciarMusica()
    else this.detenerMusica()
    this.guardar()
    return this.musicaActiva
  }

  alternarSilencio() {
    this.silenciado = !this.silenciado
    if (this.ctx) this.maestro.gain.setTargetAtTime(this.silenciado ? 0 : 0.8, this.ctx.currentTime, 0.02)
    this.guardar()
    return this.silenciado
  }
}

export const sonido = new Sonido()
