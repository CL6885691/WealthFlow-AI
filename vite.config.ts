import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // loadEnv loads .env files. The third argument '' means load all env vars, including system/shell ones.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    // START CHANGE: Set base to relative path for GitHub Pages deployment
    base: './',
    // END CHANGE
    plugins: [react()],
    define: {
      // Define explicit replacements for process.env variables.
      // This allows usage of process.env.KEY in client-side code without a polyfill.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      'process.env.VITE_FIREBASE_API_KEY': JSON.stringify(env.VITE_FIREBASE_API_KEY || ''),
      'process.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(env.VITE_FIREBASE_AUTH_DOMAIN || ''),
      'process.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(env.VITE_FIREBASE_PROJECT_ID || ''),
      'process.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(env.VITE_FIREBASE_STORAGE_BUCKET || ''),
      'process.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(env.VITE_FIREBASE_MESSAGING_SENDER_ID || ''),
      'process.env.VITE_FIREBASE_APP_ID': JSON.stringify(env.VITE_FIREBASE_APP_ID || ''),
    },
    build: {
      outDir: 'dist',
    }
  };
});