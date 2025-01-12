import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => ({
  plugins: [react()],
  server: {
    headers: {}
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        inlineDynamicImports: false,
      }
    }
  },
  optimizeDeps: {
    exclude: ['js-cookie']
  }
})); 