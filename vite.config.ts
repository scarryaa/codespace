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
    'process.env': process.env
  },
});
