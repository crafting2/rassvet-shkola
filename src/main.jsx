import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client' // <-- Заменили createRoot на hydrateRoot
import './index.css'
import App from './App.jsx'

hydrateRoot(
    document.getElementById('root'),
    <StrictMode>
        <App />
    </StrictMode>,
)
