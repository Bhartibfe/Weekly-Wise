import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    include: [
      'react-router-dom',
      'lucide-react',
      'prop-types',
      '@hello-pangea/dnd'
    ]
  },
  build: {
    commonjsOptions: {
      include: [
        /node_modules/,
        /hello-pangea/
      ]
    }
  }
})