import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Schedule from './components/Schedule'
import Documents from './components/Documents'
import Reviews from './components/Reviews'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import Privacy from './pages/Privacy' // <-- Добавили импорт
import ScrollToTop from './ScrollToTop'
import './App.css'

function Home() {
    const location = useLocation()

    useEffect(() => {
        if (location.state?.scrollToContact) {
            setTimeout(() => {
                const contactElement = document.getElementById('contact')
                if (contactElement) {
                    contactElement.scrollIntoView({ behavior: 'smooth' })
                }
            }, 100)
        }
    }, [location])

    return (
        <>
            <Hero />
            <About />
            <Services />
            <Schedule />
            <Documents />
            <Reviews />
            <Contact />
        </>
    )
}

function App() {
    return (
        <Router>
            <ScrollToTop />
            <div className="app">
                <Header />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/privacy" element={<Privacy />} /> {/* <-- Добавили маршрут */}
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    )
}

export default App