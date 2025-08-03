import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // This is crucial!
    globals: true,
    setupFiles: ['src/tests/setup.ts'],
  },
})