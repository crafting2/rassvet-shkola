import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import Editor from '../components/Editor'
import './auth.css'

const ADMIN_EMAIL = 'zhutova2015@mail.ru'

const fieldLabels = {
    header_logo: 'Название школы (в шапке сайта)',
    hero_title: 'Главный экран: Заголовок',
    hero_desc: 'Главный экран: Подзаголовок',
    hero_stat_1_num: 'Статистика 1: Цифра',
    hero_stat_1_text: 'Статистика 1: Текст',
    hero_stat_2_num: 'Статистика 2: Цифра',
    hero_stat_2_text: 'Статистика 2: Текст',
    hero_stat_3_num: 'Статистика 3: Цифра',
    hero_stat_3_text: 'Статистика 3: Текст',
    about_text_1: 'Обо мне: Абзац 1',
    about_text_2: 'Обо мне: Абзац 2',
    about_text_3: 'Обо мне: Абзац 3',
    about_text_4: 'Обо мне: Абзац 4',
    about_text_5: 'Обо мне: Абзац 5',
    about_card_title: 'Обо мне: Заголовок карточки',
    about_card_text: 'Обо мне: Текст карточки',
    about_hobby_title: 'Обо мне: Заголовок (Личное)',
    about_hobby_text: 'Обо мне: Текст (Личное)',
    services_title: 'Направления: Заголовок',
    service_1_title: 'Направление 1: Название',
    service_1_price: 'Направление 1: Цена',
    service_1_desc: 'Направление 1: Описание',
    service_2_title: 'Направление 2: Название',
    service_2_price: 'Направление 2: Цена',
    service_2_desc: 'Направление 2: Описание',
    service_3_title: 'Направление 3: Название',
    service_3_price: 'Направление 3: Цена',
    service_3_desc: 'Направление 3: Описание',

    // НОВЫЕ ПОЛЯ ДЛЯ МОДАЛЬНЫХ ОКОН
    mod_speed_1: 'Скорочтение (Модалка): Для кого',
    mod_speed_2: 'Скорочтение (Модалка): Как проходят',
    mod_speed_3: 'Скорочтение (Модалка): Результат',
    mod_callig_1: 'Каллиграфия (Модалка): Для кого',
    mod_callig_2: 'Каллиграфия (Модалка): Как проходят',
    mod_callig_3: 'Каллиграфия (Модалка): Результат',
    mod_mult_1: 'Умножение (Модалка): Для кого',
    mod_mult_2: 'Умножение (Модалка): Как проходят',
    mod_mult_3: 'Умножение (Модалка): Результат',

    schedule_title: 'Расписание: Заголовок',
    schedule_note: 'Расписание: Текст под заголовком',
    documents_title: 'Документы: Заголовок',
    documents_intro: 'Документы: Текст под заголовком',
    contact_title: 'Контакты: Заголовок',
    contact_text: 'Контакты: Текст',
    contact_phone: 'Контакты: Телефон',
    contact_max_link: 'Контакты: Ссылка на MAX',
    footer_text: 'Подвал сайта'
}

function Admin() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('students')

    const [children, setChildren] = useState([])
    const [homeworks, setHomeworks] = useState([])
    const [selectedChild, setSelectedChild] = useState(null)
    const [taskText, setTaskText] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [successMsg, setSuccessMsg] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)
    const [editingHw, setEditingHw] = useState(null)
    const [editText, setEditText] = useState('')
    const [editDate, setEditDate] = useState('')
    const [deleteHwId, setDeleteHwId] = useState(null)

    const [nextLessonText, setNextLessonText] = useState('')
    const [isSavingLesson, setIsSavingLesson] = useState(false)

    const [deactivateChildId, setDeactivateChildId] = useState(null)
    const [deactivateChildName, setDeactivateChildName] = useState('')

    const [content, setContent] = useState({})
    const [saveStatus, setSaveStatus] = useState(null)

    const [documents, setDocuments] = useState([])
    const [newDocTitle, setNewDocTitle] = useState('')
    const [newDocYear, setNewDocYear] = useState('')
    const [newDocDesc, setNewDocDesc] = useState('')
    const [newDocFile, setNewDocFile] = useState(null)
    const [isUploading, setIsUploading] = useState(false)

    const [editingDocId, setEditingDocId] = useState(null)
    const [editDocTitle, setEditDocTitle] = useState('')
    const [editDocYear, setEditDocYear] = useState('')
    const [editDocDesc, setEditDocDesc] = useState('')
    const [deleteDocId, setDeleteDocId] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user || user.email !== ADMIN_EMAIL) { navigate('/'); return }
            setUser(user)

            const { data: childrenData } = await supabase.from('children').select('*').eq('is_active', true).order('created_at', { ascending: true })
            setChildren(childrenData || [])
            fetchHomeworks()
            fetchContent()
            fetchDocuments()
            setLoading(false)
        }
        checkAdmin()
    }, [navigate])

    const fetchHomeworks = async () => {
        const { data } = await supabase.from('homework').select('*, children(full_name)').order('created_at', { ascending: false })
        setHomeworks(data || [])
    }

    const fetchContent = async () => {
        const { data } = await supabase.from('site_content').select('*')
        if (data) {
            const contentObj = {}
            data.forEach(item => { contentObj[item.key] = item.value })
            setContent(contentObj)
        }
    }

    const fetchDocuments = async () => {
        const { data } = await supabase.from('documents').select('*').order('year', { ascending: true })
        setDocuments(data || [])
    }

    const handleSelectChild = (child) => {
        setSelectedChild(child)
        setNextLessonText(child.next_lesson || '')
    }

    const handleSaveNextLesson = async () => {
        if (!selectedChild) return
        setIsSavingLesson(true)
        const { error } = await supabase.from('children').update({ next_lesson: nextLessonText }).eq('id', selectedChild.id)
        if (error) {
            alert('Ошибка: ' + error.message)
        } else {
            setSuccessMsg('Время следующего занятия обновлено!')
            setTimeout(() => setSuccessMsg(null), 3000)
            setChildren(children.map(c => c.id === selectedChild.id ? { ...c, next_lesson: nextLessonText } : c))
        }
        setIsSavingLesson(false)
    }

    const maxDate = new Date().getFullYear() + 3 + '-12-31'

    const handleAddHomework = async (e) => {
        e.preventDefault()
        if (!selectedChild) return
        setIsSaving(true)
        setSuccessMsg(null)
        setErrorMsg(null)

        const { error } = await supabase.from('homework').insert([{ child_id: selectedChild.id, task_text: taskText, due_date: dueDate || null }])

        if (error) setErrorMsg('Ошибка: ' + error.message)
        else {
            setSuccessMsg(`Задание для ${selectedChild.full_name} успешно добавлено!`)
            setTaskText('')
            setDueDate('')
            setSelectedChild(null)
            setNextLessonText('')
            fetchHomeworks()
            setTimeout(() => setSuccessMsg(null), 3000)
        }
        setIsSaving(false)
    }

    const handleDeactivateChild = (childId, childName) => {
        setDeactivateChildId(childId)
        setDeactivateChildName(childName)
    }

    const confirmDeactivateChild = async () => {
        if (!deactivateChildId) return
        const { error } = await supabase.from('children').update({ is_active: false }).eq('id', deactivateChildId)
        if (error) setErrorMsg('Ошибка: ' + error.message)
        else {
            setChildren(children.filter(c => c.id !== deactivateChildId))
            setSuccessMsg(`${deactivateChildName} переведен в статус "Завершил обучение".`)
            setTimeout(() => setSuccessMsg(null), 3000)
        }
        setDeactivateChildId(null)
        setDeactivateChildName('')
    }

    const startEdit = (hw) => {
        setEditingHw(hw.id)
        setEditText(hw.task_text)
        setEditDate(hw.due_date || '')
    }

    const handleUpdateHomework = async (id) => {
        const { error } = await supabase.from('homework').update({ task_text: editText, due_date: editDate || null }).eq('id', id)
        if (error) alert('Ошибка: ' + error.message)
        else { setEditingHw(null); fetchHomeworks() }
    }

    const confirmDeleteHomework = async () => {
        if (!deleteHwId) return
        const { error } = await supabase.from('homework').delete().eq('id', deleteHwId)
        if (error) alert('Ошибка: ' + error.message)
        else { setHomeworks(homeworks.filter(h => h.id !== deleteHwId)); setDeleteHwId(null) }
    }

    const handleContentChange = (key, value) => {
        setContent({ ...content, [key]: value })
    }

    const handleSaveContent = async (key) => {
        setSaveStatus('saving')
        const { error } = await supabase.from('site_content').upsert({ key: key, value: content[key] }, { onConflict: 'key' })
        if (error) { setSaveStatus('error'); alert('Ошибка: ' + error.message) }
        else { setSaveStatus('saved'); setTimeout(() => setSaveStatus(null), 2000) }
    }

    const handleAddDocument = async (e) => {
        e.preventDefault()
        if (!newDocFile) { alert('Выберите фото документа'); return }
        setIsUploading(true)

        const fileExt = newDocFile.name.split('.').pop()
        const fileName = `doc-${Math.random()}.${fileExt}`

        const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, newDocFile)
        if (uploadError) { alert('Ошибка загрузки: ' + uploadError.message); setIsUploading(false); return }

        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName)

        const { error } = await supabase.from('documents').insert([{
            title: newDocTitle,
            year: newDocYear,
            description: newDocDesc,
            image_url: publicUrl
        }])

        if (error) alert('Ошибка сохранения: ' + error.message)
        else {
            setNewDocTitle('')
            setNewDocYear('')
            setNewDocDesc('')
            setNewDocFile(null)
            fetchDocuments()
        }
        setIsUploading(false)
    }

    const startEditDoc = (doc) => {
        setEditingDocId(doc.id)
        setEditDocTitle(doc.title)
        setEditDocYear(doc.year)
        setEditDocDesc(doc.description)
    }

    const handleUpdateDocument = async (id) => {
        const { error } = await supabase.from('documents').update({
            title: editDocTitle,
            year: editDocYear,
            description: editDocDesc
        }).eq('id', id)

        if (error) alert('Ошибка: ' + error.message)
        else { setEditingDocId(null); fetchDocuments() }
    }

    const confirmDeleteDoc = async () => {
        if (!deleteDocId) return
        const { error } = await supabase.from('documents').delete().eq('id', deleteDocId)
        if (error) alert('Ошибка: ' + error.message)
        else { setDocuments(documents.filter(d => d.id !== deleteDocId)); setDeleteDocId(null) }
    }

    if (loading) return <div className="dashboard-loading">Загрузка админки...</div>

    return (
        <div className="dashboard">
            <div className="dashboard__inner" style={{ maxWidth: '1100px' }}>
                <div className="dashboard__header">
                    <div>
                        <h1 className="dashboard__title">Админ-панель</h1>
                        <p style={{ color: 'var(--text-light)', marginTop: '4px' }}>Панель преподавателя: {user?.email}</p>
                    </div>
                    <button onClick={() => navigate('/dashboard')} className="btn btn--ghost">В личный кабинет</button>
                </div>

                {successMsg && <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '16px', borderRadius: '8px', marginBottom: '20px', fontSize: '1.1rem', fontWeight: 'bold' }}>✅ {successMsg}</div>}
                {errorMsg && <div style={{ background: '#ffebee', color: '#c62828', padding: '16px', borderRadius: '8px', marginBottom: '20px', fontSize: '1.1rem', fontWeight: 'bold' }}>❌ {errorMsg}</div>}

                <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', borderBottom: '1px solid var(--border)', paddingBottom: '16px', flexWrap: 'wrap' }}>
                    <button className={`btn ${activeTab === 'students' ? 'btn--primary' : 'btn--ghost'}`} onClick={() => setActiveTab('students')}>Ученики и Домашки</button>
                    <button className={`btn ${activeTab === 'content' ? 'btn--primary' : 'btn--ghost'}`} onClick={() => setActiveTab('content')}>Редактор сайта</button>
                    <button className={`btn ${activeTab === 'documents' ? 'btn--primary' : 'btn--ghost'}`} onClick={() => setActiveTab('documents')}>Документы</button>
                </div>

                {activeTab === 'students' && (
                    <>
                        <div className="dashboard__grid">
                            <div className="dash-card">
                                <h3>👨‍🎓 Активные ученики ({children.length})</h3>
                                {children.length === 0 ? <p>Пока нет активных детей.</p> : (
                                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '16px' }}>
                                        {children.map(child => (
                                            <li key={child.id} style={{ padding: '12px', marginBottom: '8px', borderRadius: '8px', background: selectedChild?.id === child.id ? 'var(--accent)' : 'var(--bg-alt)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div onClick={() => handleSelectChild(child)} style={{ cursor: 'pointer', flex: 1 }}>
                                                        <strong>{child.full_name}</strong> ({child.grade} класс)
                                                    </div>
                                                    <button onClick={() => handleDeactivateChild(child.id, child.full_name)} style={{ background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.75rem' }}>Завершить</button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="dash-card">
                                <h3>📝 Информация для ученика</h3>
                                {!selectedChild ? <p style={{ marginTop: '16px' }}>Выберите ученика слева.</p> : (
                                    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                        <div style={{ paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
                                            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Ученик: {selectedChild.full_name}</p>

                                            <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '8px' }}>Следующее занятие</label>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <input
                                                    type="text"
                                                    value={nextLessonText}
                                                    onChange={(e) => setNextLessonText(e.target.value)}
                                                    placeholder="Например: Понедельник, 15:00"
                                                    style={{ flex: 1, padding: '14px', borderRadius: '8px', border: '1px solid var(--border)' }}
                                                />
                                                <button onClick={handleSaveNextLesson} className="btn btn--primary" disabled={isSavingLesson}>{isSavingLesson ? '...' : 'Сохранить'}</button>
                                            </div>
                                        </div>

                                        <div>
                                            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Выдать домашнее задание</p>
                                            <form onSubmit={handleAddHomework} className="auth-form">
                                                <textarea placeholder="Текст задания..." value={taskText} onChange={(e) => setTaskText(e.target.value)} required rows="4" style={{ padding: '14px', borderRadius: '14px', border: '1px solid var(--border)' }} />
                                                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} max={maxDate} />
                                                <button type="submit" className="btn btn--primary" disabled={isSaving}>{isSaving ? 'Отправка...' : 'Задать задание'}</button>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ marginTop: '40px' }}>
                            <h2 className="dashboard__subtitle">Последние выданные задания</h2>
                            {homeworks.length === 0 ? <p>Заданий пока нет.</p> : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                                    {homeworks.map(hw => (
                                        <div key={hw.id} className="dash-card" style={{ padding: '20px' }}>
                                            {editingHw === hw.id ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                    <div style={{ fontWeight: 'bold', color: 'var(--primary-dark)' }}>{hw.children?.full_name} (Редактирование)</div>
                                                    <textarea value={editText} onChange={(e) => setEditText(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', width: '100%' }} rows="3" />
                                                    <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }} max={maxDate} />
                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                        <button onClick={() => handleUpdateHomework(hw.id)} className="btn btn--primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Сохранить</button>
                                                        <button onClick={() => setEditingHw(null)} className="btn btn--ghost" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Отмена</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <div>
                                                        <div style={{ fontWeight: 'bold', color: 'var(--primary-dark)', marginBottom: '4px' }}>{hw.children?.full_name}</div>
                                                        <div style={{ fontSize: '0.9rem', color: 'var(--text)', marginBottom: '8px' }}>{hw.task_text}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Срок: {hw.due_date || 'без срока'}</div>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button onClick={() => startEdit(hw)} style={{ background: '#e3f2fd', color: '#1565c0', border: '1px solid #bbdefb', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>Изменить</button>
                                                        <button onClick={() => setDeleteHwId(hw.id)} style={{ background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>Удалить</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {activeTab === 'content' && (
                    <div>
                        <h2 className="dashboard__subtitle">Редактор контента</h2>
                        <p style={{ color: 'var(--text-light)', marginBottom: '24px', fontSize: '1.1rem' }}>
                            Выделите текст и используйте панель инструментов сверху, чтобы изменить цвет или сделать его жирным.
                        </p>

                        {saveStatus === 'saved' && <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '16px', borderRadius: '8px', marginBottom: '20px', fontSize: '1.1rem' }}>✅ Изменения сохранены!</div>}

                        {Object.keys(fieldLabels).map(key => (
                            <div className="dash-card" style={{ marginBottom: '24px', padding: '32px' }} key={key}>
                                <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text)' }}>
                                    {fieldLabels[key]}
                                </label>

                                {/* ПРОВЕРКА: если ключ начинается с hero_stat, используем input, иначе Editor */}
                                {key.startsWith('hero_stat') || key === 'contact_max_link' ? (
                                    <input
                                        type="text"
                                        value={content[key] || ''}
                                        onChange={(e) => handleContentChange(key, e.target.value)}
                                        style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1.1rem' }}
                                    />
                                ) : (
                                    <Editor
                                        value={content[key] || ''}
                                        onChange={(value) => handleContentChange(key, value)}
                                    />
                                )}

                                <button onClick={() => handleSaveContent(key)} className="btn btn--primary" style={{ marginTop: '16px', padding: '12px 24px', fontSize: '1rem' }}>Сохранить</button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div>
                        <h2 className="dashboard__subtitle">Управление документами</h2>

                        <div className="dash-card" style={{ marginBottom: '40px', padding: '32px' }}>
                            <h3>Добавить новый документ</h3>
                            <form onSubmit={handleAddDocument} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                                <input type="text" placeholder="Название документа" value={newDocTitle} onChange={(e) => setNewDocTitle(e.target.value)} required style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }} />
                                <input type="text" placeholder="Год" value={newDocYear} onChange={(e) => setNewDocYear(e.target.value)} required style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }} />
                                <textarea placeholder="Описание" value={newDocDesc} onChange={(e) => setNewDocDesc(e.target.value)} rows="3" style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }} />
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Фото документа</label>
                                    <input type="file" accept="image/*" onChange={(e) => setNewDocFile(e.target.files[0])} required style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', width: '100%' }} />
                                </div>
                                <button type="submit" className="btn btn--primary" disabled={isUploading}>{isUploading ? 'Загрузка...' : 'Добавить документ'}</button>
                            </form>
                        </div>

                        <h3>Существующие документы</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                            {documents.map(doc => (
                                <div key={doc.id} className="dash-card" style={{ padding: '20px', display: 'flex', gap: '16px' }}>
                                    <img src={doc.image_url} alt={doc.title} style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                                    {editingDocId === doc.id ? (
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <input value={editDocTitle} onChange={(e) => setEditDocTitle(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }} />
                                            <input value={editDocYear} onChange={(e) => setEditDocYear(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }} />
                                            <textarea value={editDocDesc} onChange={(e) => setEditDocDesc(e.target.value)} rows="2" style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }} />
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => handleUpdateDocument(doc.id)} className="btn btn--primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Сохранить</button>
                                                <button onClick={() => setEditingDocId(null)} className="btn btn--ghost" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Отмена</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '4px' }}>{doc.title}</div>
                                            <div style={{ color: 'var(--primary-dark)', fontSize: '0.9rem', marginBottom: '4px' }}>{doc.year}</div>
                                            <div style={{ color: 'var(--text-light)', fontSize: '0.85rem', flex: 1 }}>{doc.description}</div>
                                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                                <button onClick={() => startEditDoc(doc)} style={{ background: '#e3f2fd', color: '#1565c0', border: '1px solid #bbdefb', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.8rem' }}>Изменить</button>
                                                <button onClick={() => setDeleteDocId(doc.id)} style={{ background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.8rem' }}>Удалить</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {deleteHwId && (
                <div className="modal-overlay" onClick={() => setDeleteHwId(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center', maxWidth: '400px' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🗑️</div>
                        <h3 style={{ marginBottom: '12px' }}>Удалить задание?</h3>
                        <p style={{ color: 'var(--text-light)', marginBottom: '24px' }}>Ученик больше не увидит это задание.</p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button onClick={() => setDeleteHwId(null)} className="btn btn--ghost" style={{ flex: 1 }}>Отмена</button>
                            <button onClick={confirmDeleteHomework} className="btn btn--primary" style={{ flex: 1, background: '#c62828', borderColor: '#c62828' }}>Да, удалить</button>
                        </div>
                    </div>
                </div>
            )}

            {deleteDocId && (
                <div className="modal-overlay" onClick={() => setDeleteDocId(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center', maxWidth: '400px' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🗑️</div>
                        <h3 style={{ marginBottom: '12px' }}>Удалить документ?</h3>
                        <p style={{ color: 'var(--text-light)', marginBottom: '24px' }}>Он исчезнет с сайта.</p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button onClick={() => setDeleteDocId(null)} className="btn btn--ghost" style={{ flex: 1 }}>Отмена</button>
                            <button onClick={confirmDeleteDoc} className="btn btn--primary" style={{ flex: 1, background: '#c62828', borderColor: '#c62828' }}>Да, удалить</button>
                        </div>
                    </div>
                </div>
            )}

            {deactivateChildId && (
                <div className="modal-overlay" onClick={() => setDeactivateChildId(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center', maxWidth: '400px' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎓</div>
                        <h3 style={{ marginBottom: '12px' }}>Завершить обучение?</h3>
                        <p style={{ color: 'var(--text-light)', marginBottom: '24px' }}>Вы уверены, что хотите завершить обучение для <strong>{deactivateChildName}</strong>?</p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button onClick={() => setDeactivateChildId(null)} className="btn btn--ghost" style={{ flex: 1 }}>Отмена</button>
                            <button onClick={confirmDeactivateChild} className="btn btn--primary" style={{ flex: 1, background: '#c62828', borderColor: '#c62828' }}>Да, завершить</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Admin