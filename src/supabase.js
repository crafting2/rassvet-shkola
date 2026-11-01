import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wecwvwxbxdgpqjefqhsc.supabase.co'
const supabaseKey = 'sb_publishable_mqlYHSqgURYmBj2SMSOR9A_qm_OJqzx'

export const supabase = createClient(supabaseUrl, supabaseKey)