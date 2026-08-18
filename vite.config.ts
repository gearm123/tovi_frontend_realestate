import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Large videos on OneDrive/Windows lock fs.watch and crash the dev server.
      ignored: ['**/*.mp4', '**/*.webm', '**/*.mov', '**/media-source/**'],
    },
  },
})
