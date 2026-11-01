import { useNavigate } from 'react-router-dom'

function Multiplication() {
    const navigate = useNavigate()

    return (
        <div className="page-container">
            <div className="container">
                <button onClick={() => navigate(-1)} className="back-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
                    ← Назад
                </button>

                <h1 className="page-title">Таблица умножения</h1>
                <p className="page-subtitle">Осваиваем таблицу умножения за 10 занятий без зубрежки</p>

                <div className="page-content">
                    <div className="page-block">
                        <h2>Для кого этот курс?</h2>
                        <p>Для учеников 2–4 классов, которые:</p>
                        <ul>
                            <li>Не могут запомнить таблицу умножения;</li>
                            <li>Допускают ошибки в примерах;</li>
                            <li>Боятся контрольных работ по математике;</li>
                            <li>Хотят научиться считать быстро и легко.</li>
                        </ul>
                    </div>

                    <div className="page-block">
                        <h2>Как проходят занятия?</h2>
                        <ul>
                            <li><strong>Игровой подход:</strong> учим таблицу через игры и ассоциации;</li>
                            <li><strong>Работа с карточками:</strong> тренируем память и скорость реакции;</li>
                            <li><strong>Онлайн-тренажеры:</strong> закрепляем знания на интерактивной платформе;</li>
                            <li><strong>Ежедневные пятиминутки:</strong> закрепляем результат дома.</li>
                        </ul>
                    </div>

                    <div className="page-block">
                        <h2>Результат</h2>
                        <ul>
                            <li>Знание таблицы умножения наизусть;</li>
                            <li>Умение быстро решать примеры в уме;</li>
                            <li>Повышение уверенности на уроках математики;</li>
                            <li>Готовность к контрольным и самостоятельным работам.</li>
                        </ul>
                    </div>
                </div>

                <div className="page-cta">
                    <h3>Забудьте о зубрежке!</h3>
                    <p>Запишитесь на пробное занятие, и мы покажем, как легко учить таблицу.</p>
                    <button onClick={() => navigate('/', { state: { scrollToContact: true } })} className="btn btn--primary">
                        Записаться на пробное
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Multiplication