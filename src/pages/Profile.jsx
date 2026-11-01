import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabase'
import './auth.css'

function Profile() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const [fullName, setFullName] = useState('')
    const [avatarFile, setAvatarFile] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(null)

    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        const getProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                navigate('/login')
                return
            }
            setUser(user)

            const { data } = await supabase
                .from('profiles')
                .select('full_name, avatar_url')
                .eq('id', user.id)
                .single()

            if (data) {
                setFullName(data.full_name || '')
                if (data.avatar_url) setAvatarPreview(data.avatar_url)
            }
            setLoading(false)
        }
        getProfile()
    }, [navigate])

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setAvatarFile(file)
            setAvatarPreview(URL.createObjectURL(file))
        }
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        setMessage(null)

        let newAvatarUrl = avatarPreview

        // Если выбрали новое фото — загружаем его
        if (avatarFile) {
            const fileExt = avatarFile.name.split('.').pop()
            const fileName = `${user.id}-${Math.random()}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, avatarFile)

            if (!uploadError) {
                const { data: { publicUrl } } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(fileName)
                newAvatarUrl = publicUrl
            } else {
                setMessage('Ошибка загрузки фото.')
            }
        }

        // Обновляем профиль в базе
        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: fullName,
                avatar_url: newAvatarUrl
            })
            .eq('id', user.id)

        if (error) {
            setMessage('Ошибка сохранения: ' + error.message)
        } else {
            setMessage('Профиль успешно обновлен!')
        }
        setIsSaving(false)
    }

    if (loading) return <div className="dashboard-loading">Загрузка...</div>

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ maxWidth: '500px' }}>
                <h2>Мой профиль</h2>
                <Link to="/dashboard" className="auth-back" style={{ textAlign: 'left', display: 'block', marginBottom: '20px' }}>
                    ← В личный кабинет
                </Link>

                <form onSubmit={handleSave} className="auth-form">
                    <div className="avatar-upload-wrapper">
                        <label htmlFor="avatar-edit" className="avatar-upload-label">
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
                            id="avatar-edit"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="avatar-upload-input"
                        />
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', textAlign: 'center', marginTop: '8px' }}>
                            Нажмите на кружок, чтобы изменить фото
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
                        value={user.email}
                        disabled
                        style={{ background: '#eee', color: '#999', cursor: 'not-allowed' }}
                        title="Email изменить нельзя"
                    />

                    {message && (
                        <p style={{
                            color: message.includes('успешно') ? '#2e7d32' : '#c62828',
                            textAlign: 'center',
                            background: message.includes('успешно') ? '#e8f5e9' : '#ffebee',
                            padding: '10px',
                            borderRadius: '8px'
                        }}>
                            {message}
                        </p>
                    )}

                    <button type="submit" className="btn btn--primary" disabled={isSaving}>
                        {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Profile