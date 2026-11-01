import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export function useSiteContent() {
    const [content, setContent] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchContent = async () => {
            const { data } = await supabase.from('site_content').select('*')
            if (data) {
                const contentObj = {}
                data.forEach(item => { contentObj[item.key] = item.value })
                setContent(contentObj)
            }
            setLoading(false)
        }
        fetchContent()
    }, [])

    return { content, loading }
}