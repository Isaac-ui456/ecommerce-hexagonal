import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración estándar de Vite. El backend corre en :3000, el frontend en :5173.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // necesario para exponer el servidor dentro de WSL al navegador de Windows
    port: 5173,
  },
});
