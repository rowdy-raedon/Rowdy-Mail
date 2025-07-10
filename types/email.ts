export interface EmailAttachment {
  filename: string
  contentType: string
  size: number
}

export interface Message {
  id: number | string
  from: string
  subject: string
  date: string
  body?: string
  textBody?: string
  htmlBody?: string
  attachments: EmailAttachment[]
}

export interface TempEmail {
  id: string
  email: string
  login: string
  domain: string
  userId: string
  createdAt: string
  expiresAt: string | null
  isActive: boolean
  messagesCount: number
  messages: Message[]
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}

export interface EmailApiRequest {
  action: 'getMessages' | 'getMessage' | 'generateEmail'
  email?: string
  messageId?: string
}

export interface MailsacApiMessage {
  _id?: string
  from?: Array<{ address: string }> | string
  subject?: string
  received?: string
  attachments?: EmailAttachment[]
}