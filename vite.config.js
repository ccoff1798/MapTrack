// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // Load environment variables from .env files
import dotenv from 'dotenv';
dotenv.config();

// export default defineConfig({
//   plugins: [react()],
  // define: {
  //   'process.env': process.env, // Make all environment variables available
  // },
//   proxy: {
//     '/graphql': {
//       target: 'http://localhost:3001',
//       secure: false,
//       changeOrigin: true
//     }
//   }
// });

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    define: {
      'process.env': process.env, // Make all environment variables available
    },
    proxy: {
        '/graphql': {
          target: 'http://localhost:3001',
          secure: false,
          changeOrigin: true
        }
      }
    }
  }
)

