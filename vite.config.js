import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Load environment variables from .env files
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env, // Make all environment variables available
  },
});
