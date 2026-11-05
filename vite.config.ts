import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const IMAGEN = /\.(jpe?g|png|webp|gif|avif)$/i

// base './' → rutas relativas: funciona en GitHub Pages sin importar el nombre del repositorio.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Las fotos se publican sin el nombre de la persona, para no arruinar la sorpresa.
        assetFileNames: (asset) =>
          IMAGEN.test(asset.names?.[0] ?? '') ? 'assets/foto-[hash][extname]' : 'assets/[name]-[hash][extname]',
      },
    },
  },
})
