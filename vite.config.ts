import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { getCSPString } from './src/config/csp';

export default defineConfig(({ command, mode }) => ({
  plugins: [react()],
  server: {
    headers: {
      'Content-Security-Policy': getCSPString(mode === 'development'),
    },
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
    exclude: ['js-cookie'] // Exclude problematic dependencies if any
  }
})); 