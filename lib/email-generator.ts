import { randomBytes } from 'crypto'
import { supabase } from './supabase'

export interface TempEmailOptions {
  userId?: string
  teamId?: string
  expiresIn?: number // hours
  prefix?: string
}

export interface TempEmail {
  id: string
  email: string
  userId: string | null
  teamId: string | null
  createdAt: string
  expiresAt: string | null
  isActive: boolean
  messagesCount: number
}

const DOMAIN = 'rowdymail.pro'

export class EmailGenerator {
  static generateRandomId(length: number = 8): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    return Array.from(randomBytes(length))
      .map(byte => chars[byte % chars.length])
      .join('')
  }

  static generateEmailAddress(prefix?: string): string {
    const randomId = this.generateRandomId()
    const localPart = prefix ? `${prefix}-${randomId}` : randomId
    return `${localPart}@${DOMAIN}`
  }

  static async createTempEmail(options: TempEmailOptions = {}): Promise<TempEmail> {
    const email = this.generateEmailAddress(options.prefix)
    const expiresAt = options.expiresIn 
      ? new Date(Date.now() + options.expiresIn * 60 * 60 * 1000).toISOString()
      : null

    const { data, error } = await supabase
      .from('temp_emails')
      .insert({
        email,
        user_id: options.userId || null,
        team_id: options.teamId || null,
        expires_at: expiresAt,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create temp email: ${error.message}`)
    }

    return {
      id: data.id,
      email: data.email,
      userId: data.user_id,
      teamId: data.team_id,
      createdAt: data.created_at,
      expiresAt: data.expires_at,
      isActive: data.is_active,
      messagesCount: data.messages_count,
    }
  }

  static async getTempEmails(userId: string): Promise<TempEmail[]> {
    const { data, error } = await supabase
      .from('temp_emails')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch temp emails: ${error.message}`)
    }

    return data.map(item => ({
      id: item.id,
      email: item.email,
      userId: item.user_id,
      teamId: item.team_id,
      createdAt: item.created_at,
      expiresAt: item.expires_at,
      isActive: item.is_active,
      messagesCount: item.messages_count,
    }))
  }

  static async deactivateEmail(emailId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('temp_emails')
      .update({ is_active: false })
      .eq('id', emailId)
      .eq('user_id', userId)

    if (error) {
      throw new Error(`Failed to deactivate email: ${error.message}`)
    }
  }

  static async cleanupExpiredEmails(): Promise<void> {
    const { error } = await supabase.rpc('cleanup_expired_emails')

    if (error) {
      throw new Error(`Failed to cleanup expired emails: ${error.message}`)
    }
  }

  static async getEmailStats(userId: string): Promise<{
    totalEmails: number
    activeEmails: number
    totalMessages: number
  }> {
    const { data: emails, error: emailsError } = await supabase
      .from('temp_emails')
      .select('id, is_active, messages_count')
      .eq('user_id', userId)

    if (emailsError) {
      throw new Error(`Failed to fetch email stats: ${emailsError.message}`)
    }

    const totalEmails = emails.length
    const activeEmails = emails.filter(e => e.is_active).length
    const totalMessages = emails.reduce((sum, e) => sum + e.messages_count, 0)

    return {
      totalEmails,
      activeEmails,
      totalMessages,
    }
  }
}