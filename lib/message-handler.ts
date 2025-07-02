import { supabase } from './supabase'

export interface IncomingMessage {
  to: string
  from: string
  subject: string
  textBody: string
  htmlBody?: string
  attachments?: Array<{
    filename: string
    contentType: string
    size: number
    content: string // base64 encoded
  }>
}

export interface Message {
  id: string
  tempEmailId: string
  fromEmail: string
  subject: string
  bodyText: string
  bodyHtml: string | null
  attachments: any[] | null
  receivedAt: string
  isRead: boolean
}

export class MessageHandler {
  static async processIncomingMessage(message: IncomingMessage): Promise<void> {
    // Find the temp email record
    const { data: tempEmail, error: emailError } = await supabase
      .from('temp_emails')
      .select('id, is_active')
      .eq('email', message.to.toLowerCase())
      .eq('is_active', true)
      .single()

    if (emailError || !tempEmail) {
      console.log(`Temp email not found or inactive: ${message.to}`)
      return
    }

    // Store the message
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        temp_email_id: tempEmail.id,
        from_email: message.from,
        subject: message.subject,
        body_text: message.textBody,
        body_html: message.htmlBody || null,
        attachments: message.attachments || null,
      })

    if (messageError) {
      throw new Error(`Failed to store message: ${messageError.message}`)
    }

    console.log(`Message stored for temp email: ${message.to}`)
  }

  static async getMessages(tempEmailId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('temp_email_id', tempEmailId)
      .order('received_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch messages: ${error.message}`)
    }

    return data.map(item => ({
      id: item.id,
      tempEmailId: item.temp_email_id,
      fromEmail: item.from_email,
      subject: item.subject,
      bodyText: item.body_text,
      bodyHtml: item.body_html,
      attachments: item.attachments,
      receivedAt: item.received_at,
      isRead: item.is_read,
    }))
  }

  static async markAsRead(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId)

    if (error) {
      throw new Error(`Failed to mark message as read: ${error.message}`)
    }
  }

  static async deleteMessage(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId)

    if (error) {
      throw new Error(`Failed to delete message: ${error.message}`)
    }
  }

  static async getAllMessagesForUser(userId: string): Promise<Array<Message & { tempEmail: string }>> {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        temp_emails!inner(email, user_id)
      `)
      .eq('temp_emails.user_id', userId)
      .order('received_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch user messages: ${error.message}`)
    }

    return data.map(item => ({
      id: item.id,
      tempEmailId: item.temp_email_id,
      fromEmail: item.from_email,
      subject: item.subject,
      bodyText: item.body_text,
      bodyHtml: item.body_html,
      attachments: item.attachments,
      receivedAt: item.received_at,
      isRead: item.is_read,
      tempEmail: (item.temp_emails as any).email,
    }))
  }
}