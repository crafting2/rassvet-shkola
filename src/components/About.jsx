import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

function About() {
    const [data, setData] = useState({
        text1: 'Здравствуйте! Меня зовут Жутова Галина Фёдоровна...',
        text2: 'Прошла курсы повышения квалификации...',
        text3: 'Ведь чтение — важнейшее условие успеваемости...',
        text4: 'Мои ученики не только повышают технику чтения...',
        text5: 'Считаю, что за скорочтением и развитием мозга большое будущее...',
        cardTitle: 'Как проходят занятия',
        cardText: '✔ Дистанционно: офлайн и онлайн через Zoom\n✔ Индивидуально, в парах и мини-группах\n✔ Работа в рабочей тетради\n✔ Задания на интерактивной доске\n✔ Развиваем ответственное отношение к учёбе',
        hobbyTitle: 'Немного личного',
        hobbyText: 'Моё хобби — вождение автомобиля, путешествия, скандинавская ходьба. Мой девиз: «Движение — это жизнь».\nПостоянно занимаюсь саморазвитием. Познакомилась с методикой Шамиля Ахмадуллина, автора книги «Скорочтение», — как научить ребёнка быстро читать за 18 дней, проводя занятия по 30 минут в день.\nЕсли вы хотите улучшить у ребёнка скорость чтения в 2 раза и развить его способности — буду рада сотрудничать с вами.'
    })

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await supabase.from('site_content').select('*')
            if (data) {
                const obj = {}
                data.forEach(item => { obj[item.key] = item.value })
                setData(prev => ({
                    ...prev,
                    text1: obj.about_text_1 || prev.text1,
                    text2: obj.about_text_2 || prev.text2,
                    text3: obj.about_text_3 || prev.text3,
                    text4: obj.about_text_4 || prev.text4,
                    text5: obj.about_text_5 || prev.text5,
                    cardTitle: obj.about_card_title || prev.cardTitle,
                    cardText: obj.about_card_text || prev.cardText,
                    hobbyTitle: obj.about_hobby_title || prev.hobbyTitle,
                    hobbyText: obj.about_hobby_text || prev.hobbyText
                }))
            }
        }
        fetchData()
    }, [])

    const renderParagraphs = (text) => {
        if (!text) return null
        return text.split('\n').map((paragraph, index) => (
            <p key={index} style={{ marginBottom: '16px' }} dangerouslySetInnerHTML={{ __html: paragraph }} />
        ))
    }

    return (
        <section id="about" className="section about">
            <div className="container">
                <h2 className="section__title">Обо мне</h2>
                <div className="about__grid">
                    <div className="about__text">
                        {renderParagraphs(data.text1)}
                        {renderParagraphs(data.text2)}
                        {renderParagraphs(data.text3)}
                        {renderParagraphs(data.text4)}
                        {renderParagraphs(data.text5)}
                    </div>
                    <div className="about__card">
                        <h3 dangerouslySetInnerHTML={{ __html: data.cardTitle }} />
                        {renderParagraphs(data.cardText)}
                    </div>
                </div>
                <div className="about__hobby">
                    <h3 dangerouslySetInnerHTML={{ __html: data.hobbyTitle }} />
                    {renderParagraphs(data.hobbyText)}
                </div>
            </div>
        </section>
    )
}

export default About