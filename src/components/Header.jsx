import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../supabase'

const ADMIN_EMAIL = 'zhutova2015@mail.ru'

function Header() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [logo, setLogo] = useState('Школа нового поколения «Рассвет»')
    const [activeSection, setActiveSection] = useState('home')
    const location = useLocation()

    const isScrolling = useRef(false)

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user || null)
            const { data } = await supabase.from('site_content').select('value').eq('key', 'header_logo').single()
            if (data?.value) setLogo(data.value)
            setLoading(false)
        }
        checkUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null)
        })

        return () => subscription.unsubscribe()
    }, [])

    useEffect(() => {
        if (location.pathname !== '/') {
            setActiveSection('')
            return
        }

        const handleScroll = () => {
            if (isScrolling.current) return

            const scrollPosition = window.scrollY
            const windowHeight = window.innerHeight
            const documentHeight = document.documentElement.scrollHeight

            // Если мы в самом низу — активна "Записаться" (contact)
            if (scrollPosition + windowHeight >= documentHeight - 200) {
                setActiveSection('contact')
                return
            }

            const sections = ['about', 'services', 'schedule', 'documents', 'reviews']
            let currentSection = 'home'

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = document.getElementById(sections[i])
                if (section) {
                    const sectionTop = section.offsetTop
                    if (scrollPosition + 200 >= sectionTop) {
                        currentSection = sections[i]
                        break
                    }
                }
            }

            setActiveSection(currentSection)
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll()

        return () => window.removeEventListener('scroll', handleScroll)
    }, [location.pathname])

    const isAdmin = user?.email === ADMIN_EMAIL

    const scrollToTop = () => {
        if (location.pathname === '/') {
            isScrolling.current = true
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setActiveSection('home')
            setTimeout(() => { isScrolling.current = false }, 800)
        }
        setIsMenuOpen(false)
    }

    const handleNavClick = (sectionId) => {
        setActiveSection(sectionId)
        setIsMenuOpen(false)
        isScrolling.current = true
        setTimeout(() => { isScrolling.current = false }, 800)
    }

    // ИСПРАВЛЕННАЯ ФУНКЦИЯ СТИЛЕЙ
    const getLinkStyle = (sectionId) => {
        const isActive = location.pathname === '/' && activeSection === sectionId

        if (isActive) {
            // Активная ссылка (кнопка) — с отступами
            return {
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: 'var(--radius)',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'background-color 0.2s',
                whiteSpace: 'nowrap'
            }
        } else {
            // Неактивная ссылка — без отступов, чтобы стояла плотно
            return {
                color: 'var(--text-light)',
                textDecoration: 'none',
                padding: '8px 0',
                margin: '0 12px',
                transition: 'color 0.2s',
                whiteSpace: 'nowrap',
                display: 'inline-block'
            }
        }
    }

    return (
        <header className="header">
            <div className="container header__inner">
                <Link to="/" className="logo" onClick={scrollToTop} style={{ whiteSpace: 'nowrap', flexShrink: 0 }} dangerouslySetInnerHTML={{ __html: logo }} />

                <button className="header__burger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? '✕' : '☰'}
                </button>

                <nav className={`nav ${isMenuOpen ? 'nav--open' : ''}`}>
                    <Link to="/" onClick={scrollToTop} style={getLinkStyle('home')}>Главная</Link>
                    <a href="/#about" onClick={() => handleNavClick('about')} style={getLinkStyle('about')}>Обо мне</a>
                    <a href="/#services" onClick={() => handleNavClick('services')} style={getLinkStyle('services')}>Услуги</a>
                    <a href="/#schedule" onClick={() => handleNavClick('schedule')} style={getLinkStyle('schedule')}>Расписание</a>
                    <a href="/#documents" onClick={() => handleNavClick('documents')} style={getLinkStyle('documents')}>Документы</a>
                    <a href="/#reviews" onClick={() => handleNavClick('reviews')} style={getLinkStyle('reviews')}>Отзывы</a>
                    <a href="/#contact" onClick={() => handleNavClick('contact')} style={getLinkStyle('contact')}>Записаться</a>

                    <div className="nav__actions">
                        {loading ? null : user ? (
                            <>
                                {isAdmin && (
                                    <Link to="/admin" className="btn btn--ghost" onClick={() => setIsMenuOpen(false)} style={{ color: '#c62828', borderColor: '#c62828' }}>Админка</Link>
                                )}
                                <Link to="/dashboard" className="btn btn--ghost" onClick={() => setIsMenuOpen(false)}>Личный кабинет</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn--ghost" onClick={() => setIsMenuOpen(false)}>Войти</Link>
                                <Link to="/register" className="btn btn--primary" onClick={() => setIsMenuOpen(false)}>Регистрация</Link>
                            </>
                        )}
                    </div>
                </nav>

                <div className="header__actions">
                    {loading ? null : user ? (
                        <>
                            {isAdmin && (
                                <Link to="/admin" className="btn btn--ghost" style={{ color: '#c62828', borderColor: '#c62828' }}>Админка</Link>
                            )}
                            <Link to="/dashboard" className="btn btn--ghost">Личный кабинет</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn--ghost">Войти</Link>
                            <Link to="/register" className="btn btn--primary">Регистрация</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header