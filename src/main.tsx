import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./components/theme-provider";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="aegis-theme">
        <App />
      </ThemeProvider>
    </StrictMode>,
  );
}
