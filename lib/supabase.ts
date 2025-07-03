import { createClient } from '@supabase/supabase-js'

export interface Database {
  public: {
    Tables: {
      temp_emails: {
        Row: {
          id: string
          email: string
          login: string
          domain: string
          user_id: string | null
          created_at: string
          expires_at: string | null
          is_active: boolean
          messages_count: number
        }
        Insert: {
          id?: string
          email: string
          login: string
          domain: string
          user_id?: string | null
          created_at?: string
          expires_at?: string | null
          is_active?: boolean
          messages_count?: number
        }
        Update: {
          id?: string
          email?: string
          login?: string
          domain?: string
          user_id?: string | null
          created_at?: string
          expires_at?: string | null
          is_active?: boolean
          messages_count?: number
        }
      }
      messages: {
        Row: {
          id: string
          temp_email_id: string
          from_email: string
          subject: string
          body_text: string
          body_html: string | null
          attachments: any[] | null
          received_at: string
          is_read: boolean
        }
        Insert: {
          id?: string
          temp_email_id: string
          from_email: string
          subject: string
          body_text: string
          body_html?: string | null
          attachments?: any[] | null
          received_at?: string
          is_read?: boolean
        }
        Update: {
          id?: string
          temp_email_id?: string
          from_email?: string
          subject?: string
          body_text?: string
          body_html?: string | null
          attachments?: any[] | null
          received_at?: string
          is_read?: boolean
        }
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Missing Supabase environment variables')
  }
  console.warn('Missing Supabase environment variables - using placeholder client')
}

export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)