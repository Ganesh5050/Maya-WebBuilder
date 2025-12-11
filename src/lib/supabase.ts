import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://simngjynepjayqkwmkau.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpbW5nanluZXBqYXlxa3dta2F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MTkyOTcsImV4cCI6MjA3OTk5NTI5N30.2aY4lq6Y3ijUx0GUpvaqSFB6l2UJXpOPGzd5_UU8U_Q'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface User {
  id: string
  email: string
  created_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Component {
  id: string
  project_id: string
  type: string
  props: Record<string, any>
  styles: Record<string, any>
  order: number
  created_at: string
}

export interface Template {
  id: string
  name: string
  description: string
  components: Component[]
  preview_image?: string
  created_at: string
}
