import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styling/main.css";
import "./styling/nav.css";
import "./styling/display.css";
import "./styling/auth.css";
import { App } from "./app.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
