import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { DarkVeil } from './components/DarkVeil.jsx'
import './components/DarkVeil.css'

// Render DarkVeil separately in body
createRoot(document.getElementById('darkveil-root')).render(
  <StrictMode>
    <div className="darkveil-wrapper">
      <DarkVeil />
    </div>
  </StrictMode>,
)

// Render main app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
