import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

function Footer() {
    const [text, setText] = useState(`© ${new Date().getFullYear()} Школа нового поколения «Рассвет». Сделано с ❤️`)

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await supabase.from('site_content').select('value').eq('key', 'footer_text').single()
            if (data?.value) setText(data.value)
        }
        fetchData()
    }, [])

    return (
        <footer className="footer">
            <div className="container footer__inner">
                <p dangerouslySetInnerHTML={{ __html: text }} />
            </div>
        </footer>
    )
}

export default Footer