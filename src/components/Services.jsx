import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

function Services() {
    // Начальные данные (полные тексты, как были изначально)
    const [data, setData] = useState({
        title: 'Наши направления',
        s1_title: 'Скорочтение',
        s1_price: 'от 600 ₽',
        s1_desc: 'Увеличиваем скорость чтения в 2 раза. Ребенок начинает понимать прочитанное с первого раза, улучшается память и внимание.',

        s2_title: 'Каллиграфия',
        s2_price: 'от 600 ₽',
        s2_desc: 'Учимся писать красиво и правильно. Развиваем мелкую моторику, исправляем почерк и повышаем уверенность на уроках.',

        s3_title: 'Таблица умножения',
        s3_price: 'от 600 ₽',
        s3_desc: 'Осваиваем таблицу умножения за 10 занятий. Без зубрежки, через игры и ассоциации. Учимся считать в уме.',

        // Тексты для модалок
        mod_speed_1: 'Для детей от 7 до 12 лет, которые читают медленно, не понимают смысл прочитанного, теряют интерес к книгам или хотят успевать по всем предметам в школе.',
        mod_speed_2: 'В игровой форме: работа с текстом, нейроупражнения, интерактивные задания, домашние задания для закрепления результата.',
        mod_speed_3: 'Скорость чтения увеличивается в 2 раза. Ребенок начинает понимать прочитанное с первого раза, улучшается память и успеваемость.',

        mod_callig_1: 'Для детей от 8 до 12 лет с неразборчивым почерком, проблемами с написанием букв, быстрой утомляемостью при письме.',
        mod_callig_2: 'Постановка руки, работа с прописями, развитие моторики, творческие задания (открытки, мини-сочинения).',
        mod_callig_3: 'Красивый и разборчивый почерк, увеличение скорости письма, развитие усидчивости и уверенности в себе.',

        mod_mult_1: 'Для учеников 2–4 классов, которые не могут запомнить таблицу, допускают ошибки в примерах или боятся контрольных.',
        mod_mult_2: 'Игровой подход, работа с карточками, онлайн-тренажеры, ежедневные пятиминутки для закрепления.',
        mod_mult_3: 'Знание таблицы умножения наизусть, умение быстро решать примеры в уме, готовность к контрольным работам.'
    })

    const [activeModal, setActiveModal] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await supabase.from('site_content').select('*')
            if (data) {
                const obj = {}
                data.forEach(item => { obj[item.key] = item.value })

                // Обновляем данные, только если в базе что-то есть
                setData(prev => {
                    const newData = { ...prev }
                    // Проходимся по всем ключам из базы и обновляем наши данные
                    Object.keys(obj).forEach(key => {
                        if (obj[key]) newData[key] = obj[key]
                    })
                    return newData
                })
            }
            setLoading(false)
        }
        fetchData()
    }, [])

    const serviceDetails = {
        speedreading: {
            title: data.s1_title,
            subtitle: 'Увеличиваем скорость чтения в 2 раза и улучшаем понимание прочитанного',
            blocks: [
                { title: 'Для кого этот курс?', text: data.mod_speed_1 },
                { title: 'Как проходят занятия?', text: data.mod_speed_2 },
                { title: 'Результат', text: data.mod_speed_3 }
            ]
        },
        calligraphy: {
            title: data.s2_title,
            subtitle: 'Учимся писать красиво и правильно',
            blocks: [
                { title: 'Для кого этот курс?', text: data.mod_callig_1 },
                { title: 'Как проходят занятия?', text: data.mod_callig_2 },
                { title: 'Результат', text: data.mod_callig_3 }
            ]
        },
        multiplication: {
            title: data.s3_title,
            subtitle: 'Осваиваем таблицу умножения за 10 занятий без зубрежки',
            blocks: [
                { title: 'Для кого этот курс?', text: data.mod_mult_1 },
                { title: 'Как проходят занятия?', text: data.mod_mult_2 },
                { title: 'Результат', text: data.mod_mult_3 }
            ]
        }
    }

    return (
        <section id="services" className="section services">
            <div className="container">
                <h2 className="section__title" dangerouslySetInnerHTML={{ __html: data.title }} />

                <div className="services__grid">
                    {/* Карточка 1 */}
                    <div className="service-card">
                        <h3 dangerouslySetInnerHTML={{ __html: data.s1_title }} />
                        <p className="service-card__price" dangerouslySetInnerHTML={{ __html: data.s1_price }} />
                        <p className="service-card__desc" dangerouslySetInnerHTML={{ __html: data.s1_desc }} />
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: 'auto' }}>
                            <button onClick={() => setActiveModal('speedreading')} className="btn btn--primary">Подробнее</button>
                            <a href="/#contact" className="btn btn--ghost">Записаться</a>
                        </div>
                    </div>

                    {/* Карточка 2 */}
                    <div className="service-card">
                        <h3 dangerouslySetInnerHTML={{ __html: data.s2_title }} />
                        <p className="service-card__price" dangerouslySetInnerHTML={{ __html: data.s2_price }} />
                        <p className="service-card__desc" dangerouslySetInnerHTML={{ __html: data.s2_desc }} />
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: 'auto' }}>
                            <button onClick={() => setActiveModal('calligraphy')} className="btn btn--primary">Подробнее</button>
                            <a href="/#contact" className="btn btn--ghost">Записаться</a>
                        </div>
                    </div>

                    {/* Карточка 3 */}
                    <div className="service-card">
                        <h3 dangerouslySetInnerHTML={{ __html: data.s3_title }} />
                        <p className="service-card__price" dangerouslySetInnerHTML={{ __html: data.s3_price }} />
                        <p className="service-card__desc" dangerouslySetInnerHTML={{ __html: data.s3_desc }} />
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: 'auto' }}>
                            <button onClick={() => setActiveModal('multiplication')} className="btn btn--primary">Подробнее</button>
                            <a href="/#contact" className="btn btn--ghost">Записаться</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* МОДАЛЬНОЕ ОКНО */}
            {activeModal && (
                <div className="modal-overlay" onClick={() => setActiveModal(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', textAlign: 'left' }}>
                        <button
                            onClick={() => setActiveModal(null)}
                            style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-light)' }}
                        >
                            ✕
                        </button>

                        <h2 style={{ color: 'var(--primary-dark)', marginBottom: '8px' }} dangerouslySetInnerHTML={{ __html: serviceDetails[activeModal].title }} />
                        <p style={{ color: 'var(--text-light)', marginBottom: '24px', fontSize: '0.95rem' }}>
                            {serviceDetails[activeModal].subtitle}
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                            {serviceDetails[activeModal].blocks.map((block, i) => (
                                <div key={i}>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--text)' }}>
                                        {block.title}
                                    </h3>
                                    <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }} dangerouslySetInnerHTML={{ __html: block.text }} />
                                </div>
                            ))}
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <a href="/#contact" className="btn btn--primary" onClick={() => setActiveModal(null)}>
                                Записаться на курс
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default Services