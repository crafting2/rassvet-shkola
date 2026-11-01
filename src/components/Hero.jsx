import { useState, useEffect } from 'react'
import galinaPhoto from '../assets/galina.jpg'
import { supabase } from '../supabase'

function Hero() {
    const [data, setData] = useState({
        title: 'Комплексное развитие детей 1–4 классов',
        desc: 'Скорочтение, каллиграфия и таблица умножения — в одном месте...',
        stat1_num: '40+ лет', stat1_text: 'педагогического стажа',
        stat2_num: '3', stat2_text: 'направления обучения',
        stat3_num: '×2', stat3_text: 'скорость чтения',
        photo: galinaPhoto
    })

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await supabase.from('site_content').select('*')
            if (data) {
                const obj = {}
                data.forEach(item => { obj[item.key] = item.value })
                setData({
                    title: obj.hero_title || data.title,
                    desc: obj.hero_desc || data.desc,
                    stat1_num: obj.hero_stat_1_num || '40+ лет',
                    stat1_text: obj.hero_stat_1_text || 'педагогического стажа',
                    stat2_num: obj.hero_stat_2_num || '3',
                    stat2_text: obj.hero_stat_2_text || 'направления обучения',
                    stat3_num: obj.hero_stat_3_num || '×2',
                    stat3_text: obj.hero_stat_3_text || 'скорость чтения',
                    photo: obj.hero_photo || galinaPhoto
                })
            }
        }
        fetchData()
    }, [])

    return (
        <section className="hero">
            <div className="container hero__inner">
                <div className="hero__text">
                    <p className="hero__tag">Школа нового поколения «Рассвет»</p>
                    <h1 dangerouslySetInnerHTML={{ __html: data.title }} />
                    <p className="hero__desc" dangerouslySetInnerHTML={{ __html: data.desc }} />
                    <div className="hero__buttons">
                        <a href="#contact" className="btn btn--primary">Записаться на пробное занятие</a>
                        <a href="#services" className="btn btn--ghost">Наши направления</a>
                    </div>
                    <div className="hero__stats">
                        <div><strong>{data.stat1_num}</strong><span>{data.stat1_text}</span></div>
                        <div><strong>{data.stat2_num}</strong><span>{data.stat2_text}</span></div>
                        <div><strong>{data.stat3_num}</strong><span>{data.stat3_text}</span></div>
                    </div>
                </div>
                <div className="hero__photo">
                    <img src={data.photo} alt="Школа Рассвет" />
                </div>
            </div>
        </section>
    )
}

export default Hero