import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // On inclut le manifest ici pour forcer sa création correcte
      manifest: {
        name: 'حاسبة الدومينو',
        short_name: 'دومينو',
        description: 'تطبيق ويب بسيط وأنيق لتتبع نتائج ألعاب الدومينو.',
        theme_color: '#1e293b',
        background_color: '#1e293b',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png', // Assurez-vous que le chemin est correct
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-512x512.png', // Assurez-vous que le chemin est correct
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        screenshots: [
          {
            src: '/screenshots/capture-ecran-1.png',
            type: 'image/png',
            sizes: '1080x1920',
            form_factor: 'narrow'
          },
          {
            src: '/screenshots/capture-ecran-2.png',
            type: 'image/png',
            sizes: '1080x1920',
            form_factor: 'narrow'
          }
        ]
      }
    })
  ],
})