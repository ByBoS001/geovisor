import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ixsolpgsauhihfyagbyo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4c29scGdzYXVoaWhmeWFnYnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5ODY4NDUsImV4cCI6MjA2OTU2Mjg0NX0.bVD5WHewwPME5OTDCnzmffId0JSisumT-4b5KqwSc7c'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
