import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

function Contact() {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [message, setMessage] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [status, setStatus] = useState(null)

    const [data, setData] = useState({
        title: 'Запишитесь на пробное занятие',
        text: 'Познакомимся, определим уровень чтения ребёнка и составим план занятий. Буду рада сотрудничать с вами!',
        phone: '+7 983 602-38-61',
        maxLink: 'https://max.ru/u/f9LHodD0cOIlHFLdv3rS5JMw9kc5YZQ4UJY0ei9aq0D8YiG0MTxrOl_TCeU'
    })

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await supabase.from('site_content').select('*')
            if (data) {
                const obj = {}
                data.forEach(item => { obj[item.key] = item.value })
                setData(prev => ({
                    ...prev,
                    title: obj.contact_title || prev.title,
                    text: obj.contact_text || prev.text,
                    phone: obj.contact_phone || prev.phone,
                    maxLink: obj.contact_max_link || prev.maxLink
                }))
            }
        }
        fetchData()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSending(true)
        setStatus(null)
        try {
            const response = await fetch('https://functions.yandexcloud.net/d4ejmpev0t0r9bqi5ipi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, message }),
            })
            if (response.ok) {
                setStatus('success'); setName(''); setPhone(''); setMessage('')
            } else { setStatus('error') }
        } catch (error) { setStatus('error') } finally { setIsSending(false) }
    }

    return (
        <section id="contact" className="section contact">
            <div className="container contact__inner">
                <div className="contact__text">
                    <h2 dangerouslySetInnerHTML={{ __html: data.title }} />
                    <p dangerouslySetInnerHTML={{ __html: data.text }} />
                    <div className="contact__links">
                        <a href={data.maxLink} target="_blank" rel="noreferrer" className="btn btn--primary" style={{ textAlign: 'center', marginBottom: '12px', color: '#fff', textDecoration: 'none' }}>Написать в MAX</a>
                        <span style={{ color: 'var(--text)', fontWeight: '600', fontSize: '1.05rem', textAlign: 'center' }}>Телефон для связи: {data.phone}</span>
                    </div>
                </div>
                <form className="contact__form" onSubmit={handleSubmit}>
                    <input type="text" placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)} required disabled={isSending} />
                    <input type="tel" placeholder="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} required disabled={isSending} />
                    <textarea placeholder="Имя и возраст ребёнка, цель занятий" rows="3" value={message} onChange={(e) => setMessage(e.target.value)} disabled={isSending} />
                    <button type="submit" className="btn btn--primary" disabled={isSending}>{isSending ? 'Отправка...' : 'Отправить заявку'}</button>

                    {status === 'success' && <p className="form__message form__message--success">✅ Спасибо! Заявка отправлена. Я свяжусь с вами в ближайшее время.</p>}
                    {status === 'error' && <p className="form__message form__message--error">❌ Ошибка при отправке. Пожалуйста, напишите нам в MAX.</p>}

                    {!status && (
                        <p className="form__note">
                            Нажимая кнопку, я даю согласие на{' '}
                            <a href="/privacy" target="_blank" rel="noreferrer" style={{ color: 'var(--primary-dark)', textDecoration: 'underline' }}>
                                обработку персональных данных
                            </a>
                        </p>
                    )}
                </form>
            </div>
        </section>
    )
}

export default Contact