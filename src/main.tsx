console.log("Current URL Hash:", window.location.hash);
if (window.location.hash.includes("access_token")) {
  console.log("Found access token in URL! Supabase should be processing this...");
}
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
