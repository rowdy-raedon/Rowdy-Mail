import { supabase } from './supabase'
import { MailsacAPI } from './mailsac-api'

export interface TempEmailOptions {
  userId?: string
  expiresIn?: number // hours
  customLogin?: string
}

export interface TempEmail {
  id: string
  email: string
  login: string
  domain: string
  userId: string | null
  createdAt: string
  expiresAt: string | null
  isActive: boolean
  messagesCount: number
}

export class EmailGenerator {
  static async createTempEmail(options: TempEmailOptions = {}): Promise<TempEmail> {
    console.log('Creating temp email with options:', options)
    
    const expiresAt = options.expiresIn 
      ? new Date(Date.now() + options.expiresIn * 60 * 60 * 1000).toISOString()
      : null

    // Generate email using Mailsac
    const email = options.customLogin 
      ? MailsacAPI.generateCustomEmail(options.customLogin)
      : MailsacAPI.generateRandomEmail()

    console.log('Generated email address:', email)
    
    const { login, domain } = MailsacAPI.parseEmail(email)
    console.log('Parsed email - login:', login, 'domain:', domain)

    const insertData = {
      email,
      login,
      domain,
      user_id: options.userId || null,
      expires_at: expiresAt,
    }
    console.log('Inserting data:', insertData)

    const { data, error } = await supabase
      .from('temp_emails')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw new Error(`Failed to create temp email: ${error.message}`)
    }
    
    console.log('Database response:', data)

    return {
      id: data.id,
      email: data.email,
      login: data.login,
      domain: data.domain,
      userId: data.user_id,
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
      login: item.login,
      domain: item.domain,
      userId: item.user_id,
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

  static async fetchMessages(email: TempEmail): Promise<any[]> {
    try {
      const messages = await MailsacAPI.getMessages(email.email)
      
      // Transform Mailsac messages to our format
      return messages.map(msg => ({
        id: msg._id,
        from: msg.from[0]?.address || '',
        subject: msg.subject,
        date: msg.received,
        body: '', // Will be fetched separately if needed
        textBody: '', // Will be fetched separately if needed
        htmlBody: '', // Will be fetched separately if needed
        attachments: msg.attachments || [],
      }))
    } catch (error) {
      console.error('Failed to fetch messages:', error)
      return []
    }
  }

  static async fetchMessage(email: TempEmail, messageId: string): Promise<any> {
    try {
      const message = await MailsacAPI.getMessage(email.email, messageId)
      if (!message) return null

      const htmlContent = await MailsacAPI.getMessageHTML(email.email, messageId)
      
      return {
        id: message._id,
        from: message.from,
        subject: message.subject,
        date: message.received,
        body: message.text || '',
        textBody: message.text || '',
        htmlBody: htmlContent || '',
        headers: message.headers,
      }
    } catch (error) {
      console.error('Failed to fetch message:', error)
      return null
    }
  }

  static async waitForMessages(email: TempEmail, timeout: number = 30000): Promise<any[]> {
    try {
      const messages = await MailsacAPI.waitForMessages(email.email, timeout)
      
      // Transform Mailsac messages to our format
      return messages.map(msg => ({
        id: msg._id,
        from: msg.from[0]?.address || '',
        subject: msg.subject,
        date: msg.received,
        body: '', // Will be fetched separately if needed
        textBody: '', // Will be fetched separately if needed
        htmlBody: '', // Will be fetched separately if needed
        attachments: msg.attachments || [],
      }))
    } catch (error) {
      console.error('Failed to wait for messages:', error)
      return []
    }
  }

  static async checkEmailExists(email: string): Promise<boolean> {
    try {
      return await MailsacAPI.checkInboxExists(email)
    } catch (error) {
      console.error('Failed to check email exists:', error)
      return false
    }
  }
}