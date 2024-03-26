import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        // babel-macro is needed for lingui
        plugins: ['macros'],
      },
    }),
  ],
  build: {
    commonjsOptions: {
      esmExternals: true
    }
  },
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
    'process.env.IS_TEST': JSON.stringify(process.env.REACT_APP_ENV === 'test'),
    'process.env.IS_DEV': JSON.stringify(process.env.NODE_ENV === 'development'),
    'process.env.IS_PROD': JSON.stringify(process.env.NODE_ENV === 'production'),
    'process.env.LOG_DEBUG': JSON.stringify(process.env.REACT_APP_LOG_DEBUG || ''),
    'process.env.LOG_LEVEL': JSON.stringify(process.env.REACT_APP_LOG_LEVEL || 'info'),
  },
});
