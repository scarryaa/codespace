import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "./src/_variables.scss";
        `
      }
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    
    IS_TEST: JSON.stringify(process.env.EXPO_PUBLIC_ENV === 'test'),
    IS_DEV: JSON.stringify(process.env.NODE_ENV === 'development'),
    IS_PROD: JSON.stringify(process.env.NODE_ENV === 'production'),
    LOG_DEBUG: JSON.stringify(process.env.EXPO_PUBLIC_LOG_DEBUG || ''),
    LOG_LEVEL: JSON.stringify(process.env.EXPO_PUBLIC_LOG_LEVEL || 'info'),
  },
});
