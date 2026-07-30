import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path, { resolve } from "path";
import { componentTagger } from "lovable-tagger";
import sitemap from 'vite-plugin-sitemap';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    sitemap({
      hostname: "https://arewatrips.netlify.app",
      dynamicRoutes: [
        "/",
        "/hotels",
        "/ride-booking",
        "/delivery",
        "/group-rides",
        "/hotels/grand-pinnacle-hotel",
      ],
      generateRobotsTxt: false,
    }),
    mode === "development" && componentTagger(),
  ].filter(Boolean) as any,
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
}));
