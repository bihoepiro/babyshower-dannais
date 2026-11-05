import { BEBES, MAMA } from './data/bebes'
import { JuegoProvider } from './game/JuegoContext'
import { AcuarelaDefs } from './components/illustrations/Acuarela'
import { Presentador } from './components/Presentador'
import { Portada } from './components/scenes/Portada'
import { Historia } from './components/scenes/Historia'
import { Instrucciones } from './components/scenes/Instrucciones'
import { Ronda } from './components/scenes/Ronda'
import { Galeria } from './components/scenes/Galeria'
import { Mama } from './components/scenes/Mama'
import { Final } from './components/scenes/Final'

export default function App() {
  return (
    <JuegoProvider>
      <AcuarelaDefs />
      <main>
        <Portada />
        <Historia />
        <Instrucciones />
        {BEBES.map((bebe, i) => (
          <Ronda
            key={bebe.id}
            bebe={bebe}
            indice={i}
            total={BEBES.length}
            siguiente={BEBES[i + 1] ? `ronda-${BEBES[i + 1].id}` : 'gracias'}
          />
        ))}
        <Final />
        {MAMA && <Mama mama={MAMA} />}
        <Galeria />
      </main>
      <Presentador />
    </JuegoProvider>
  )
}
