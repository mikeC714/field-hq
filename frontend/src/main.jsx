import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/auth.css';
import './styles/alerts.css';
import './styles/profile.css';
import './styles/dashboard.css';


import { App } from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <App />
  </StrictMode>,
)
