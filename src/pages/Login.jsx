import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabase'
import { translateError } from '../errorMessages'
import './auth.css'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            setError(translateError(error))
        } else {
            navigate('/dashboard')
        }
        setLoading(false)
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Вход</h2>

                <form onSubmit={handleLogin} className="auth-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && <p className="auth-error">{error}</p>}

                    <button type="submit" className="btn btn--primary" disabled={loading}>
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>

                <p className="auth-link">
                    Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                </p>

                <Link to="/" className="auth-back">← На главную</Link>
            </div>
        </div>
    )
}

export default Login