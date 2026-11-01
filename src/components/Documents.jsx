import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

function Documents() {
    const [documents, setDocuments] = useState([])
    const [openImg, setOpenImg] = useState(null)
    const [docTitle, setDocTitle] = useState('Документы и квалификация')
    const [docIntro, setDocIntro] = useState('Образование, повышение квалификации и награды — подтверждают опыт и компетенции преподавателя.')

    useEffect(() => {
        const fetchData = async () => {
            // Загружаем заголовки
            const { data: contentData } = await supabase.from('site_content').select('*')
            if (contentData) {
                const obj = {}
                contentData.forEach(item => { obj[item.key] = item.value })
                if (obj.documents_title) setDocTitle(obj.documents_title)
                if (obj.documents_intro) setDocIntro(obj.documents_intro)
            }

            // Загружаем сами документы
            const { data: docsData } = await supabase.from('documents').select('*').order('year', { ascending: true })
            if (docsData) setDocuments(docsData)
        }
        fetchData()
    }, [])

    return (
        <section id="documents" className="section documents">
            <div className="container">
                <h2 className="section__title">{docTitle}</h2>
                <p className="documents__intro">{docIntro}</p>

                <div className="documents__grid">
                    {documents.map((d, i) => (
                        <div className="document-card" key={d.id}>
                            <button type="button" className="document-card__img" onClick={() => setOpenImg(d.image_url)}>
                                <img src={d.image_url} alt={d.title} loading="lazy" />
                            </button>
                            <div className="document-card__body">
                                <span className="document-card__year">{d.year}</span>
                                <h3>{d.title}</h3>
                                <p>{d.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {openImg && (
                <div className="lightbox" onClick={() => setOpenImg(null)}>
                    <button type="button" className="lightbox__close" onClick={() => setOpenImg(null)}>✕</button>
                    <img src={openImg} alt="Документ" />
                </div>
            )}
        </section>
    )
}

export default Documents