import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Проверяем, не было ли перенаправления с 404-страницы
const redirectPath = sessionStorage.getItem('redirectPath');
if (redirectPath) {
  // Удаляем сохраненный путь, чтобы не зациклиться
  sessionStorage.removeItem('redirectPath');
  // Меняем адрес в браузере обратно на тот, который запрашивал пользователь
  // (React Router увидит этот адрес и отрисует нужную страницу)
  window.history.replaceState(null, '', redirectPath);
}

hydrateRoot(
    document.getElementById('root'),
    <StrictMode>
        <App />
    </StrictMode>,
)
