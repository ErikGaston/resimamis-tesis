import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    open: true,
    hmr: true
  },
  optimizeDeps: {
    include: ['@mui/material', '@mui/system', '@emotion/react', '@emotion/styled'],
  },
  ssr: {
    noExternal: ['@mui/material', '@mui/base', '@mui/system'], // 👈 Asegura que estos paquetes sean procesados
  },
  define: {
    _global: ({})
  },
  build: {
    outDir: 'dist',
    ssr: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      external: [],
    },
  },
})
