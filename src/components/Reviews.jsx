import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabase'

const ADMIN_EMAIL = 'zhutova2015@mail.ru'

function Reviews() {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [userChecked, setUserChecked] = useState(false)

    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [text, setText] = useState('')
    const [rating, setRating] = useState(5)
    const [isSending, setIsSending] = useState(false)
    const [error, setError] = useState(null)
    const [successMsg, setSuccessMsg] = useState(null) // Для красивого уведомления

    const [deleteReviewId, setDeleteReviewId] = useState(null)

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
                setUser(session.user)
                const { data } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', session.user.id).single()
                if (data) setProfile(data)
            }
            setUserChecked(true)
        }
        checkUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                setUser(session.user)
                const { data } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', session.user.id).single()
                if (data) setProfile(data)
            } else {
                setUser(null)
                setProfile(null)
            }
            setUserChecked(true)
        })

        return () => subscription.unsubscribe()
    }, [])

    const isAdmin = user?.email === ADMIN_EMAIL

    const fetchReviews = async () => {
        if (!userChecked) return
        let query = supabase.from('reviews').select('*').order('created_at', { ascending: false })
        if (!isAdmin) query = query.eq('is_approved', true)
        const { data, error } = await query
        if (!error) setReviews(data || [])
        setLoading(false)
    }

    useEffect(() => { fetchReviews() }, [userChecked, isAdmin])

    const confirmDeleteReview = async () => {
        if (!deleteReviewId) return
        const { error } = await supabase.from('reviews').delete().eq('id', deleteReviewId)
        if (error) alert('Ошибка: ' + error.message)
        else { setReviews(reviews.filter(r => r.id !== deleteReviewId)); setDeleteReviewId(null) }
    }

    const handleApprove = async (id) => {
        const { error } = await supabase.from('reviews').update({ is_approved: true }).eq('id', id)
        if (error) alert('Ошибка: ' + error.message)
        else setReviews(reviews.map(r => r.id === id ? { ...r, is_approved: true } : r))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!profile?.full_name) { setError('Пожалуйста, укажите ваше имя в личном кабинете.'); return }
        setIsSending(true)
        setError(null)
        setSuccessMsg(null)

        try {
            const { error: insertError } = await supabase.from('reviews').insert([{
                author_name: profile.full_name,
                avatar_url: profile.avatar_url || null,
                text: text,
                rating: rating,
                is_approved: false
            }])
            if (insertError) throw insertError

            setText('')
            setRating(5)
            setIsFormOpen(false)

            // Показываем красивую плашку
            setSuccessMsg('Спасибо! Ваш отзыв появится на сайте совсем скоро.')

            // Скрываем плашку через 4 секунды
            setTimeout(() => setSuccessMsg(null), 4000)

            if (isAdmin) fetchReviews()
        } catch (err) {
            setError(err.message)
        } finally {
            setIsSending(false)
        }
    }

    if (!userChecked) return <div style={{ padding: '40px', textAlign: 'center' }}>Загрузка...</div>

    return (
        <section id="reviews" className="section reviews">
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                    <h2 className="section__title" style={{ margin: 0 }}>Отзывы родителей</h2>
                    {user ? (
                        <button className="btn btn--primary" onClick={() => setIsFormOpen(!isFormOpen)}>{isFormOpen ? 'Отменить' : 'Оставить отзыв'}</button>
                    ) : (
                        <Link to="/login" className="btn btn--ghost">Войдите, чтобы оставить отзыв</Link>
                    )}
                </div>

                {/* УВЕДОМЛЕНИЕ ОБ УСПЕХЕ */}
                {successMsg && (
                    <div style={{
                        background: '#e8f5e9',
                        color: '#2e7d32',
                        padding: '16px',
                        borderRadius: '14px',
                        marginBottom: '24px',
                        fontSize: '1rem',
                        border: '1px solid #c8e6c9',
                        textAlign: 'center',
                        fontWeight: '600',
                        boxShadow: '0 4px 15px rgba(46, 125, 50, 0.1)'
                    }}>
                        ✅ {successMsg}
                    </div>
                )}

                {isFormOpen && user && (
                    <div className="review-form-container">
                        <h3>Ваш отзыв</h3>
                        <p style={{ color: 'var(--text-light)', marginBottom: '16px', fontSize: '0.9rem' }}>Отзыв будет опубликован от имени: <strong>{profile?.full_name || 'Пользователь'}</strong></p>
                        <form onSubmit={handleSubmit} className="auth-form" style={{ marginTop: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Ваша оценка:</span>
                                <div style={{ display: 'flex', gap: '4px', cursor: 'pointer' }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span key={star} onClick={() => setRating(star)} style={{ fontSize: '1.5rem', color: star <= rating ? '#e5b35c' : '#ccc' }}>★</span>
                                    ))}
                                </div>
                            </div>
                            <textarea placeholder="Напишите ваш отзыв здесь..." value={text} onChange={(e) => setText(e.target.value)} required rows="4" />
                            {error && <p className="auth-error">{error}</p>}
                            <button type="submit" className="btn btn--primary" disabled={isSending}>{isSending ? 'Отправка...' : 'Оставить отзыв'}</button>
                        </form>
                    </div>
                )}

                {loading ? <p style={{ textAlign: 'center' }}>Загрузка отзывов...</p> : reviews.length === 0 ? <p style={{ textAlign: 'center', color: 'var(--text-light)' }}>Пока нет отзывов. Станьте первым!</p> : (
                    <div className="reviews__grid">
                        {reviews.map((r) => (
                            <div className="review-card" key={r.id} style={{ position: 'relative', border: !r.is_approved ? '2px dashed #e5b35c' : '1px solid var(--border)' }}>
                                {isAdmin && !r.is_approved && (
                                    <div style={{ position: 'absolute', top: 0, left: 0, background: '#e5b35c', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderBottomRightRadius: '8px' }}>На проверке</div>
                                )}
                                {isAdmin && (
                                    <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
                                        {!r.is_approved && (
                                            <button onClick={() => handleApprove(r.id)} style={{ background: '#e8f5e9', color: '#2e7d32', border: '1px solid #c8e6c9', borderRadius: '8px', padding: '4px 8px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold' }}>Опубликовать</button>
                                        )}
                                        <button onClick={() => setDeleteReviewId(r.id)} style={{ background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', borderRadius: '8px', padding: '4px 8px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold' }}>Удалить</button>
                                    </div>
                                )}
                                <div className="review-card__header" style={{ marginTop: isAdmin && !r.is_approved ? '16px' : '0' }}>
                                    {r.avatar_url ? <img src={r.avatar_url} alt={r.author_name} className="review-card__avatar" /> : <div className="review-card__avatar-placeholder">{r.author_name.charAt(0).toUpperCase()}</div>}
                                    <div className="review-card__info">
                                        <p className="review-card__name">{r.author_name}</p>
                                        <p className="review-card__stars">{'★'.repeat(r.rating || 5)}{'☆'.repeat(5 - (r.rating || 5))}</p>
                                    </div>
                                </div>
                                <p className="review-card__text">«{r.text}»</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* КРАСИВОЕ ОКНО УДАЛЕНИЯ ОТЗЫВА */}
            {deleteReviewId && (
                <div className="modal-overlay" onClick={() => setDeleteReviewId(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center', maxWidth: '400px' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🗑️</div>
                        <h3 style={{ marginBottom: '12px' }}>Удалить отзыв?</h3>
                        <p style={{ color: 'var(--text-light)', marginBottom: '24px' }}>Этот отзыв больше не будет отображаться на сайте.</p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button onClick={() => setDeleteReviewId(null)} className="btn btn--ghost" style={{ flex: 1 }}>Отмена</button>
                            <button onClick={confirmDeleteReview} className="btn btn--primary" style={{ flex: 1, background: '#c62828', borderColor: '#c62828' }}>Да, удалить</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default Reviews