import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const sim = mode === 'sim';
  const base = sim ? '/hawshat/irth-simulation/' : '/irth/';
  return {
    base,
    plugins: [
      react(),
      ...(sim
        ? []
        : [
            VitePWA({
              registerType: 'autoUpdate',
              manifest: false,
              workbox: {
                navigateFallback: '/irth/index.html',
              },
            }),
          ]),
    ],
  };
});
