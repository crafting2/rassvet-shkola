import { useNavigate } from 'react-router-dom'

function Calligraphy() {
    const navigate = useNavigate()

    return (
        <div className="page-container">
            <div className="container">
                <button onClick={() => navigate(-1)} className="back-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
                    ← Назад
                </button>

                <h1 className="page-title">Каллиграфия</h1>
                <p className="page-subtitle">Учимся писать красиво и правильно</p>

                <div className="page-content">
                    <div className="page-block">
                        <h2>Для кого этот курс?</h2>
                        <p>Для детей от 8 до 12 лет, у которых:</p>
                        <ul>
                            <li>Неразборчивый почерк;</li>
                            <li>Проблемы с написанием букв (зеркальное отражение, пропуски);</li>
                            <li>Быстрая утомляемость при письме;</li>
                            <li>Желание научиться писать красиво.</li>
                        </ul>
                    </div>

                    <div className="page-block">
                        <h2>Как проходят занятия?</h2>
                        <ul>
                            <li><strong>Постановка руки:</strong> учимся правильно держать ручку;</li>
                            <li><strong>Работа с прописями:</strong> отрабатываем каждую букву и соединение;</li>
                            <li><strong>Развитие моторики:</strong> выполняем упражнения для пальцев и кистей;</li>
                            <li><strong>Творческие задания:</strong> пишем открытки и мини-сочинения.</li>
                        </ul>
                    </div>

                    <div className="page-block">
                        <h2>Результат</h2>
                        <ul>
                            <li>Красивый и разборчивый почерк;</li>
                            <li>Увеличение скорости письма без потери качества;</li>
                            <li>Развитие усидчивости и аккуратности;</li>
                            <li>Уверенность в себе на уроках в школе.</li>
                        </ul>
                    </div>
                </div>

                <div className="page-cta">
                    <h3>Хотите красивый почерк?</h3>
                    <p>Запишитесь на первое занятие, и мы оценим текущий уровень письма.</p>
                    <button onClick={() => navigate('/', { state: { scrollToContact: true } })} className="btn btn--primary">
                        Записаться на пробное
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Calligraphy