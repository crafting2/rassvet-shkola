import { useNavigate } from 'react-router-dom'

function Speedreading() {
    const navigate = useNavigate()

    return (
        <div className="page-container">
            <div className="container">
                <button onClick={() => navigate(-1)} className="back-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
                    ← Назад
                </button>

                <h1 className="page-title">Скорочтение</h1>
                <p className="page-subtitle">Увеличиваем скорость чтения в 2 раза и улучшаем понимание прочитанного</p>

                <div className="page-content">
                    <div className="page-block">
                        <h2>Для кого этот курс?</h2>
                        <p>Для детей от 7 до 12 лет, которые:</p>
                        <ul>
                            <li>Читают медленно и не понимают смысл прочитанного;</li>
                            <li>Теряют интерес к книгам;</li>
                            <li>Испытывают трудности с пересказом текста;</li>
                            <li>Хотят успевать по всем предметам в школе.</li>
                        </ul>
                    </div>

                    <div className="page-block">
                        <h2>Как проходят занятия?</h2>
                        <p>Занятия проходят в игровой форме, чтобы ребенку было интересно.</p>
                        <ul>
                            <li><strong>Работа с текстом:</strong> учимся выделять главное и запоминать детали;</li>
                            <li><strong>Нейроупражнения:</strong> развиваем память, внимание и мышление;</li>
                            <li><strong>Интерактивные задания:</strong> работаем в рабочих тетрадях и на доске;</li>
                            <li><strong>Домашние задания:</strong> закрепляем результат между занятиями.</li>
                        </ul>
                    </div>

                    <div className="page-block">
                        <h2>Результат</h2>
                        <ul>
                            <li>Скорость чтения увеличивается в 2 раза;</li>
                            <li>Ребенок начинает понимать прочитанное с первого раза;</li>
                            <li>Улучшается память, внимание и усидчивость;</li>
                            <li>Повышается успеваемость по всем предметам.</li>
                        </ul>
                    </div>
                </div>

                <div className="page-cta">
                    <h3>Готовы попробовать?</h3>
                    <p>Запишитесь на пробное занятие, и мы определим текущий уровень ребенка.</p>
                    <button onClick={() => navigate('/', { state: { scrollToContact: true } })} className="btn btn--primary">
                        Записаться на пробное
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Speedreading