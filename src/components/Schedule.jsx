import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

function Schedule() {
    const [scheduleTitle, setScheduleTitle] = useState('Расписание занятий')
    const [scheduleNote, setScheduleNote] = useState('Занятия проходят ежедневно, включая субботу. Вы можете выбрать удобную смену и время.')

    useEffect(() => {
        const fetchContent = async () => {
            const { data } = await supabase.from('site_content').select('*')
            if (data) {
                const obj = {}
                data.forEach(item => { obj[item.key] = item.value })
                if (obj.schedule_title) setScheduleTitle(obj.schedule_title)
                if (obj.schedule_note) setScheduleNote(obj.schedule_note)
            }
        }
        fetchContent()
    }, [])

    return (
        <section id="schedule" className="section schedule">
            <div className="container">
                <h2 className="section__title">{scheduleTitle}</h2>

                <p className="schedule__info-note" style={{ textAlign: 'center', marginBottom: '40px' }}>
                    {scheduleNote}
                </p>

                <div className="schedule__grid">
                    {/* Первая смена */}
                    <div className="schedule__shift-card">
                        <h3 className="schedule__shift-title">Первая смена (Утро)</h3>
                        <div className="schedule__time-list">
                            <div className="schedule__time-item" style={{ justifyContent: 'center' }}>
                                <span className="schedule__time" style={{ fontSize: '1.2rem' }}>09:00 – 12:00</span>
                            </div>
                            <p style={{ textAlign: 'center', color: 'var(--text-light)', marginTop: '16px' }}>
                                Пн – Сб
                            </p>
                        </div>
                    </div>

                    {/* Вторая смена */}
                    <div className="schedule__shift-card">
                        <h3 className="schedule__shift-title">Вторая смена (День)</h3>
                        <div className="schedule__time-list">
                            <div className="schedule__time-item" style={{ justifyContent: 'center' }}>
                                <span className="schedule__time" style={{ fontSize: '1.2rem' }}>13:00 – 18:00</span>
                            </div>
                            <p style={{ textAlign: 'center', color: 'var(--text-light)', marginTop: '16px' }}>
                                Пн – Сб
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <a href="#contact" className="btn btn--primary">Записаться на удобное время</a>
                </div>
            </div>
        </section>
    )
}

export default Schedule