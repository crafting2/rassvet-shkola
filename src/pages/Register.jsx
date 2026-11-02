import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabase'
import { translateError } from '../errorMessages'
import './auth.css'

function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')

    const [avatarFile, setAvatarFile] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(null)

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    
    // НОВОЕ: Состояние для показа/скрытия пароля
    const [showPassword, setShowPassword] = useState(false)
    
    const navigate = useNavigate()

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setAvatarFile(file)
            setAvatarPreview(URL.createObjectURL(file))
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        })

        if (authError) {
            setError(translateError(authError))
            setLoading(false)
            return
        }

        if (authData.user) {
            let avatar_url = null

            if (avatarFile) {
                const fileExt = avatarFile.name.split('.').pop()
                const fileName = `${authData.user.id}-${Math.random()}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(fileName, avatarFile)

                if (!uploadError) {
                    const { data: { publicUrl } } = supabase.storage
                        .from('avatars')
                        .getPublicUrl(fileName)
                    avatar_url = publicUrl
                }
            }

            // Всегда регистрируем как 'parent'
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: authData.user.id,
                        role: 'parent', // Жестко задаем роль
                        full_name: fullName,
                        avatar_url: avatar_url
                    }
                ])

            if (profileError) {
                console.error('Ошибка профиля:', profileError)
            }

            navigate('/dashboard')
        }
        setLoading(false)
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Регистрация родителя</h2>

                <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '20px', fontSize: '0.9rem' }}>
                    Зарегистрируйтесь, чтобы добавлять детей и следить за их домашними заданиями.
                </p>

                <form onSubmit={handleRegister} className="auth-form">

                    <div className="avatar-upload-wrapper">
                        <label htmlFor="avatar-upload" className="avatar-upload-label">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Превью" className="avatar-upload-preview" />
                            ) : (
                                <div className="avatar-upload-placeholder">
                                    <span>+</span>
                                    <p>Фото</p>
                                </div>
                            )}
                        </label>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="avatar-upload-input"
                        />
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', textAlign: 'center', marginTop: '8px' }}>
                            Нажмите на кружок, чтобы добавить фото (необязательно)
                        </p>
                    </div>

                    <input
                        type="text"
                        placeholder="Ваше имя (ФИО)"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    
                    {/* НОВОЕ: Обертка для поля пароля с глазиком */}
                    <div style={{ position: 'relative', width: '100%' }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Пароль (мин. 6 символов)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="6"
                            style={{ width: '100%', paddingRight: '40px', boxSizing: 'border-box' }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                padding: '0',
                                color: '#666'
                            }}
                            title={showPassword ? "Скрыть пароль" : "Показать пароль"}
                        >
                            {showPassword ? '👁️' : '🙈'}
                        </button>
                    </div>

                    {error && <p className="auth-error">{error}</p>}

                    <button type="submit" className="btn btn--primary" disabled={loading}>
                        {loading ? 'Создание...' : 'Создать аккаунт'}
                    </button>
                </form>
                <p className="auth-link">
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </p>
                <Link to="/" className="auth-back">← На главную</Link>
            </div>
        </div>
    )
}

export default Register
