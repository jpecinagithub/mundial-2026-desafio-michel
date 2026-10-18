import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/*.png", "participants/*.png", "questions/*.jpg"],
      manifest: {
        name: "Mundial 2026 — El Desafío de Michel",
        short_name: "Desafío Michel",
        description:
          "Concurso de 10 preguntas difíciles sobre España en el Mundial 2026. Michel responde primero; si falla, ¡rebote!",
        theme_color: "#0a1230",
        background_color: "#0a1230",
        display: "standalone",
        orientation: "any",
        lang: "es",
        start_url: ".",
        icons: [
          {
            src: "icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // Todo el juego (JS, CSS, fotos, fuentes) queda en caché tras la
        // primera carga: la partida funciona sin conexión.
        globPatterns: ["**/*.{js,css,html,png,svg,woff2,jpg,jpeg}"],
      },
    }),
  ],
});
