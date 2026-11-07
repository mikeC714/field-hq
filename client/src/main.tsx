import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styling/auth.css";
import "./styling/main.css";
import { App } from "./app.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
