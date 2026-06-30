import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/auth.css';
import './styles/profile.css';
import './styles/dashboard.css';
import './styles/createquote.css';
import './styles/navBar.css';
import './styles/404.css';
import './styles/quoteaccept.css';


import './index.css'
import { App } from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <App />
  </StrictMode>,
)
