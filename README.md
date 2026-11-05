# 🍼 Noah · Baby Shower de Dannais

Una invitación vintage que cobra vida con el scroll y que termina en el juego **«¿Quién es ese bebé?»**: Noah cuenta su historia, presenta al equipo de su mamá y reta a los invitados a reconocer a sus futuros tíos y tías de oficina en sus fotos de bebés.

Hecho con React, TypeScript, Vite y Framer Motion. Las ilustraciones (osito, globos, nubes) son SVG con filtros de acuarela, así que no dependen de imágenes externas.

---

## Ejecutar en tu computadora

Requisitos: [Node.js](https://nodejs.org) 20.19 o superior.

```bash
cd babyshower_dannais
npm install        # solo la primera vez
npm run dev        # abre http://localhost:5173
```

Para probar la versión final (la misma que se publicará):

```bash
npm run build
npm run preview    # abre http://localhost:4173
```

> 💡 **Para el evento**, usa `npm run build` + `npm run preview`, o directamente la página publicada. Las fuentes y fotos van incluidas en el build, así que la página funciona aunque se caiga el internet una vez cargada.

---

## Cómo usarla durante el baby shower

1. Conecta la laptop al proyector y abre la página.
2. Presiona **F** para entrar en pantalla completa (modo presentación: la barra de controles y el cursor se esconden solos).
3. Avanza con **espacio** o **→** (también funcionan los presentadores inalámbricos que envían *Página abajo*).

| Acción | Cómo |
| --- | --- |
| Avanzar | `espacio`, `→`, `↓`, `Av Pág` o botón **›** de la barra |
| Volver (por ejemplo, para ver otra vez una foto) | `←`, `↑`, `Re Pág` o botón **‹** |
| Responder | Con la pregunta en pantalla, **solo empieza a escribir** y presiona `Enter` |
| Revelar sin adivinar | Enlace «Revelar sin adivinar» o botón **Revelar** de la barra |
| Corregir un resultado | «Contar como acierto / fallo» o «Volver a intentar», debajo de la respuesta |
| Ir a un bebé concreto | Los puntitos de la barra (azul = acierto, beige = fallo) |
| Reiniciar el juego | Botón ↺ de la barra (pide confirmación) o «Volver a jugar» al final |
| Ver los atajos | `?` o el botón **?** de la barra |

Detalles pensados para el evento:

- **Una pregunta abierta no se salta por accidente**: si presionas espacio con la pregunta en pantalla, el cursor va al campo de respuesta en vez de avanzar.
- **Las respuestas son tolerantes**: no importan mayúsculas ni tildes, «Rodrigo» cuenta para *Rodri*, y se acepta un error de tipeo en nombres largos. Si el grupo dijo un apodo que el sistema no reconoce, usa «Contar como acierto».
- **Si se recarga la página**, las respuestas se conservan (solo en esa pestaña). Para empezar de cero, usa «Reiniciar».
- La galería final muestra a todos los bebés con su nombre y cuántos reconoció el equipo.

---

## Agregar o cambiar fotos

Las fotos viven en `fotos/` y **el nombre del archivo es el nombre que se revela**:

```text
fotos/
  Clau.jpg     →  «Clau»
  Jose.jpg     →  «Jose»
```

Para agregar nuevas:

1. Copia las fotos a `fotos/` (formatos: `.jpg`, `.jpeg`, `.png`, `.webp`).
2. Ejecuta `npm run fotos`: lista las fotos detectadas y avisa si hay nombres raros, duplicados o formatos que el navegador no puede mostrar (por ejemplo `.heic` de iPhone).
3. Listo: el juego las incorpora solo al compilar. Las nuevas aparecen **al final**, después de las rondas existentes.

Ajustes opcionales en [`src/data/config.ts`](src/data/config.ts):

- `ORDEN`: el orden de las rondas (las fotos que no estén en la lista van al final).
- `EXCLUIR`: fotos que están en la carpeta pero no deben salir en el juego.
- `FOTO_MAMA`: la foto de la mamá (`Dannais`). No es una ronda: se revela al final como sorpresa, después del agradecimiento de Noah y antes de la galería de recuerdos. Si el archivo no existe, esa escena simplemente no aparece.
- `EVENTO.fecha` y `EVENTO.lugar`: **valores provisionales en `null`**. Si los completas, aparecen en la portada de la invitación.

---

## Nombres, apodos y alias

Las respuestas se validan con [`src/game/coincidencia.ts`](src/game/coincidencia.ts). Sin configurar nada, el juego ya acepta:

| Caso | Ejemplo (archivo → respuesta aceptada) |
| --- | --- |
| Mayúsculas, tildes y espacios | Victor → «víctor», «  VÍCTOR » |
| Nombre completo de un diminutivo | Rodri → «Rodrigo», Jime → «Jimena» |
| Diminutivo de un nombre completo | Valeria → «Vale» |
| Ortografías que suenan igual | Jime → «Gimena», Jacky → «Jaky», «Jaqui» |
| Un error de tipeo en nombres de 5+ letras | Rodri → «Rodirgo» |

Lo que no se parece al nombre del archivo (apodos, otro nombre) se agrega en [`src/data/personas.ts`](src/data/personas.ts):

```ts
export const PERSONAS: Record<string, Persona> = {
  Victor: { alias: ['Vic'] },
  Jime:   { alias: ['Jimena', 'Ximena'] },
  Clau:   { nombre: 'Claudia', alias: ['Clau'] },  // `nombre` cambia cómo se muestra al revelar
}
```

**Protección contra confusiones:** una respuesta solo cuenta si se parece más a esa persona que a cualquier otra del juego. Escribir el nombre de otro compañero, o algo ambiguo entre dos personas («Rodri o Vale»), no cuenta. Si un alias choca con el de otra persona, `npm run fotos` lo marca para corregirlo.

---

## 🎮 Segunda web: Baby Engineer vs. Data Engineer

Trivia arcade pixel art de 15 preguntas, independiente del juego de fotos. Vive en `arcade/index.html` + [`src/arcade/`](src/arcade/) y se abre en:

- Local: `http://localhost:5173/arcade/` (`npm run dev`) o `http://localhost:4173/arcade/` (`npm run build` + `npm run preview`)
- Publicada: `https://<tu-usuario>.github.io/babyshower-dannais/arcade/`

| Tecla | Acción |
| --- | --- |
| `Enter` / `Espacio` | START, saltar la cortinilla, siguiente pregunta, volver a jugar |
| `A` `B` `C` (o `1` `2` `3`) | Elegir alternativa (también con clic) |
| `M` | Música on/off |
| `S` | Silenciar todo |
| `F` | Pantalla completa |

- **Preguntas:** en [`src/arcade/preguntas.ts`](src/arcade/preguntas.ts). El juego alterna Data y Baby y deja el bonus del padrino al final. 100 puntos por acierto y 300 en el bonus (máximo 1700).
- **Música y efectos:** sintetizados en el navegador con Web Audio (melodía chiptune original, sin archivos de audio). La música arranca al presionar START.
- **HI-SCORE:** se guarda en el navegador.

---

## Publicar en GitHub Pages

La configuración ya usa rutas relativas (`base: './'`), así que funciona con cualquier nombre de repositorio.

1. Crea un repositorio en GitHub (por ejemplo `babyshower-dannais`).
2. Sube esta carpeta como raíz del repositorio:

   ```bash
   cd babyshower_dannais
   git init
   git add .
   git commit -m "Baby shower de Dannais"
   git branch -M main
   git remote add origin https://github.com/<tu-usuario>/babyshower-dannais.git
   git push -u origin main
   ```

3. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. El workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) compila y publica en cada `push` a `main`. En un par de minutos la página queda en `https://<tu-usuario>.github.io/babyshower-dannais/`.

Cada vez que agregues fotos, basta con `git add fotos && git commit -m "Nuevas fotos" && git push`.

> ⚠️ **Privacidad**: una página de GitHub Pages es pública para cualquiera que tenga el enlace, y las fotos del equipo quedarían en el repositorio. Pide permiso a cada persona antes de publicar. En la página publicada las fotos se sirven con nombres anónimos (`foto-<hash>.jpg`) para no arruinar la sorpresa, pero el repositorio sí contiene los nombres originales. Si prefieres no publicar nada, `npm run build` + `npm run preview` en la laptop del evento es suficiente.

---

## Estructura

```text
babyshower_dannais/
├── fotos/                     ← las fotos del juego (nombre de archivo = nombre)
├── scripts/revisar-fotos.mjs  ← npm run fotos
├── src/
│   ├── data/
│   │   ├── config.ts          ← orden, alias, datos del evento
│   │   └── bebes.ts           ← detecta las fotos automáticamente
│   ├── game/                  ← estado del juego y comparación de respuestas
│   ├── hooks/                 ← navegación por paradas (teclado) y animaciones
│   ├── components/
│   │   ├── scenes/            ← Portada, Historia, Instrucciones, Ronda, Galería, Final
│   │   ├── illustrations/     ← osito, globos, nubes, filtros de acuarela
│   │   └── Presentador.tsx    ← atajos, barra de control, modo presentación
│   └── styles.css             ← paleta, tipografías y estilos
└── .github/workflows/deploy.yml
```

Cada escena es una sección alta con un escenario fijo (*sticky*): el progreso del scroll dentro de la sección controla las animaciones, igual que en un scrollytelling de D3. Las «paradas» (`data-parada`) marcan los momentos clave a los que salta el teclado.
