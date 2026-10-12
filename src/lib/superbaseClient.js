import { createClient } from '@supabase/supabase-js'

const supabaseUrl = https://hdicpvinyffdywvyvcnh.supabase.co/rest/v1/
const supabaseKey = sb_publishable_fYo8jrzrq181bqSkm34lwA_eCIo4pL -

export const supabase = createClient(supabaseUrl, supabaseKey)