import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

const presentationPages = [
  '0-portfolio',
  '1-pauhelper',
  '2-orchestratordata',
  '3-voicesimulator',
].flatMap((project) =>
  ['business', 'technical'].map((audience) =>
    fileURLToPath(new URL(`./src/features/docs/${project}/${audience}.html`, import.meta.url))
  )
)

// https://vite.dev/config/
export default defineConfig({
  envDir: '..',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: [fileURLToPath(new URL('./index.html', import.meta.url)), ...presentationPages],
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.js'],
    css: true,
  },
})
