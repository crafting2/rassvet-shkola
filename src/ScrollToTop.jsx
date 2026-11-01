import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollToTop() {
    const { pathname } = useLocation()

    useEffect(() => {
        // Восстанавливаем позицию скролла при возврате на страницу
        const savedPosition = sessionStorage.getItem(`scroll-${pathname}`)

        if (savedPosition) {
            window.scrollTo({
                top: parseInt(savedPosition, 10),
                left: 0,
                behavior: 'instant'
            })
        } else {
            // Если позиции нет — скроллим наверх
            window.scrollTo(0, 0)
        }

        // Функция для сохранения позиции перед уходом со страницы
        const handleScroll = () => {
            sessionStorage.setItem(`scroll-${pathname}`, window.scrollY.toString())
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [pathname])

    return null
}

export default ScrollToTop