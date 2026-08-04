import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Stop the browser from restoring a previous scroll position (e.g. deep in
// the gallery) on reload/reopen - ScrollToHash owns scroll position instead.
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
