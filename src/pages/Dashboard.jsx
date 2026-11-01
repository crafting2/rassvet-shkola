import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabase'
import './auth.css'

function Dashboard() {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [children, setChildren] = useState([])
    const [homeworks, setHomeworks] = useState([])
    const [loading, setLoading] = useState(true)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [childName, setChildName] = useState('')
    const [childGrade, setChildGrade] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [formError, setFormError] = useState(null)

    const [editingChild, setEditingChild] = useState(null)
    const [editName, setEditName] = useState('')
    const [editGrade, setEditGrade] = useState('')
    const [editError, setEditError] = useState(null)

    const [deleteChildId, setDeleteChildId] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        const getData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { navigate('/login'); return }
            setUser(user)

            const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
            if (profileData) setProfile(profileData)

            if (profileData?.role === 'parent') {
                const { data: childrenData } = await supabase.from('children').select('*').eq('parent_id', user.id).eq('is_active', true).order('created_at', { ascending: true })
                setChildren(childrenData || [])
                if (childrenData && childrenData.length > 0) {
                    const childIds = childrenData.map(c => c.id)
                    const { data: hwData } = await supabase.from('homework').select('*, children(full_name)').in('child_id', childIds).order('created_at', { ascending: false })
                    setHomeworks(hwData || [])
                }
            }
            setLoading(false)
        }
        getData()
    }, [navigate])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    const handleAddChild = async (e) => {
        e.preventDefault()
        setFormError(null)
        if (childName.trim().length < 3) { setFormError('Имя должно содержать хотя бы 3 буквы.'); return }
        const nameRegex = /^[А-Яа-яЁёA-Za-z\s-]+$/
        if (!nameRegex.test(childName)) { setFormError('Имя может содержать только буквы, пробелы и дефисы.'); return }

        setIsSaving(true)
        const formattedName = childName.trim().charAt(0).toUpperCase() + childName.trim().slice(1)

        const { data, error } = await supabase.from('children').insert([{ parent_id: user.id, full_name: formattedName, grade: childGrade, is_active: true }]).select()
        if (error) setFormError('Ошибка базы данных: ' + error.message)
        else if (data) {
            setChildren([...children, data[0]])
            setIsModalOpen(false)
            setChildName('')
            setChildGrade('')
            setFormError(null)
        }
        setIsSaving(false)
    }

    const startEdit = (child) => {
        setEditingChild(child.id)
        setEditName(child.full_name)
        setEditGrade(child.grade || '')
        setEditError(null)
    }

    const handleUpdateChild = async (id) => {
        setEditError(null)
        if (editName.trim().length < 3) { setEditError('Имя должно содержать хотя бы 3 буквы.'); return }
        const nameRegex = /^[А-Яа-яЁёA-Za-z\s-]+$/
        if (!nameRegex.test(editName)) { setEditError('Имя может содержать только буквы, пробелы и дефисы.'); return }

        const formattedName = editName.trim().charAt(0).toUpperCase() + editName.trim().slice(1)
        const { error } = await supabase.from('children').update({ full_name: formattedName, grade: editGrade }).eq('id', id)
        if (error) alert('Ошибка: ' + error.message)
        else {
            setChildren(children.map(c => c.id === id ? { ...c, full_name: formattedName, grade: editGrade } : c))
            setEditingChild(null)
        }
    }

    const confirmDeleteChild = async () => {
        if (!deleteChildId) return
        const { error } = await supabase.from('children').delete().eq('id', deleteChildId)
        if (error) alert('Ошибка: ' + error.message)
        else {
            setChildren(children.filter(c => c.id !== deleteChildId))
            setHomeworks(homeworks.filter(h => h.child_id !== deleteChildId))
            setDeleteChildId(null)
        }
    }

    if (loading) return <div className="dashboard-loading">Загрузка...</div>
    if (!user) return null

    return (
        <div className="dashboard">
            <div className="dashboard__inner">
                <div className="dashboard__header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Аватар" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }} />
                        ) : (
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--bg-alt)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', border: '2px solid var(--border)' }}>
                                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : '?'}
                            </div>
                        )}
                        <div>
                            <h1 className="dashboard__title" style={{ marginBottom: '2px' }}>Личный кабинет</h1>
                            <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>Вы вошли как: <strong>{profile?.full_name || user.email}</strong></p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {/* Кнопка "Редактировать профиль" удалена, так как страницы /profile не существует */}
                        <button onClick={handleLogout} className="btn btn--ghost">Выйти</button>
                    </div>
                </div>

                <div className="dashboard__content">
                    <h2 className="dashboard__subtitle">Мои дети и домашние задания</h2>
                    <div className="dashboard__grid">
                        <div className="dash-card">
                            <h3>👨‍👩‍👧 Мои дети</h3>
                            {children.length === 0 ? <p>У вас пока нет активных детей.</p> : (
                                <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0' }}>
                                    {children.map(child => (
                                        <li key={child.id} style={{ marginBottom: '16px', padding: '16px', background: 'var(--bg-alt)', borderRadius: '8px' }}>
                                            {editingChild === child.id ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    <input value={editName} onChange={(e) => setEditName(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }} />
                                                    <input value={editGrade} onChange={(e) => setEditGrade(e.target.value)} placeholder="Класс" style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }} />
                                                    {editError && <p style={{ color: '#c62828', fontSize: '0.85rem' }}>{editError}</p>}
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button onClick={() => handleUpdateChild(child.id)} className="btn btn--primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Сохранить</button>
                                                        <button onClick={() => setEditingChild(null)} className="btn btn--ghost" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Отмена</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span><strong>{child.full_name}</strong> {child.grade && `(${child.grade} класс)`}</span>
                                                        <div style={{ display: 'flex', gap: '6px' }}>
                                                            <button onClick={() => startEdit(child)} style={{ background: '#e3f2fd', color: '#1565c0', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.8rem' }}>✎</button>
                                                            <button onClick={() => setDeleteChildId(child.id)} style={{ background: '#ffebee', color: '#c62828', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>
                                                        </div>
                                                    </div>

                                                    {child.next_lesson && (
                                                        <div style={{ marginTop: '12px', padding: '12px', background: '#fff', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '4px' }}>Следующее занятие:</p>
                                                            <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary-dark)' }}>{child.next_lesson}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <button onClick={() => { setIsModalOpen(true); setFormError(null); }} className="btn btn--primary" style={{ marginTop: '16px' }}>+ Добавить ребенка</button>
                        </div>

                        <div className="dash-card">
                            <h3>📚 Домашние задания</h3>
                            {homeworks.length === 0 ? <p>Пока заданий нет.</p> : (
                                <ul style={{ listStyle: 'none', padding: 0, marginTop: '16px' }}>
                                    {homeworks.map(hw => (
                                        <li key={hw.id} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold' }}>{hw.children?.full_name} (Срок: {hw.due_date || 'без срока'})</p>
                                            <p>{hw.task_text}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Модалки (без изменений) */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Добавить ребенка</h3>
                        <form onSubmit={handleAddChild} className="auth-form" style={{ marginTop: '20px' }}>
                            <input type="text" placeholder="Имя и фамилия ребенка" value={childName} onChange={(e) => setChildName(e.target.value)} required />
                            <input type="text" placeholder="Класс (например, 2А)" value={childGrade} onChange={(e) => setChildGrade(e.target.value)} />
                            {formError && <p style={{ color: '#c62828', fontSize: '0.9rem', background: '#ffebee', padding: '8px', borderRadius: '6px' }}>{formError}</p>}
                            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                                <button type="submit" className="btn btn--primary" disabled={isSaving}>{isSaving ? 'Сохранение...' : 'Сохранить'}</button>
                                <button type="button" className="btn btn--ghost" onClick={() => setIsModalOpen(false)}>Отмена</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteChildId && (
                <div className="modal-overlay" onClick={() => setDeleteChildId(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center', maxWidth: '400px' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>😢</div>
                        <h3 style={{ marginBottom: '12px' }}>Удалить ребенка?</h3>
                        <p style={{ color: 'var(--text-light)', marginBottom: '24px' }}>Все его домашние задания тоже будут удалены.</p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button onClick={() => setDeleteChildId(null)} className="btn btn--ghost" style={{ flex: 1 }}>Отмена</button>
                            <button onClick={confirmDeleteChild} className="btn btn--primary" style={{ flex: 1, background: '#c62828', borderColor: '#c62828' }}>Да, удалить</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard
