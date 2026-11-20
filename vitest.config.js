import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Config exclusiva de Vitest: no toca vite.config.js (el build queda intacto).
// Vite 4 ⇒ Vitest 0.34.x (Vitest 1.x exige Vite 5).
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    // jsdom solo habilita localStorage/sessionStorage con un origin no opaco (URL real).
    environmentOptions: {
      jsdom: { url: 'http://localhost:5173/' },
    },
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    clearMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/**/*.{test,spec}.{js,jsx}',
        'src/test/**',
        'src/main.jsx',
      ],
    },
  },
});
