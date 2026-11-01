import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            // Все запросы, начинающиеся с /max-api, будут перенаправлены на MAX
            '/max-api': {
                target: 'https://platform-api2.max.ru',
                changeOrigin: true,
                secure: false, // Игнорируем проблемы с сертификатом Минцифры
                rewrite: (path) => path.replace(/^\/max-api/, ''),
            },
        },
    },
})