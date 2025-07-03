const MAILSAC_API_KEY = process.env.MAILSAC_API_KEY
const MAILSAC_BASE_URL = 'https://mailsac.com'

export interface MailsacMessage {
  _id: string
  to: Array<{
    address: string
    name?: string
  }>
  from: Array<{
    address: string
    name?: string
  }>
  subject: string
  inbox: string
  originalInbox: string
  domain: string
  received: string
  size: number
  attachments: Array<{
    filename: string
    contentType: string
    size: number
  }>
  ip: string
  via: string
  folder: string
  labels: string[]
  read: boolean
  starred: boolean
  rtls: boolean
}

export interface MailsacMessageContent {
  _id: string
  subject: string
  from: string
  to: string
  received: string
  text?: string
  html?: string
  headers: Record<string, any>
}

export class MailsacAPI {
  private static async makeRequest(endpoint: string, options: RequestInit = {}) {
    if (!MAILSAC_API_KEY) {
      throw new Error('Mailsac API key not configured')
    }

    const url = `${MAILSAC_BASE_URL}${endpoint}`
    console.log('Making request to:', url)
    console.log('API Key (first 10 chars):', MAILSAC_API_KEY?.substring(0, 10) + '...')

    const response = await fetch(url, {
      headers: {
        'Mailsac-Key': MAILSAC_API_KEY,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const error = await response.text()
      console.error('API Error Response:', error)
      throw new Error(`Mailsac API error: ${response.status} - ${error}`)
    }

    const data = await response.json()
    console.log('Response data:', data)
    return data
  }

  static generateRandomEmail(): string {
    // Generate a random email address using mailsac.com domain
    const randomString = Math.random().toString(36).substring(2, 15)
    return `${randomString}@mailsac.com`
  }

  static generateCustomEmail(login: string): string {
    // Generate a custom email address using mailsac.com domain
    return `${login}@mailsac.com`
  }

  static async getMessages(email: string): Promise<MailsacMessage[]> {
    try {
      console.log('Fetching messages for email:', email)
      const endpoint = `/api/addresses/${encodeURIComponent(email)}/messages`
      console.log('API endpoint:', endpoint)
      
      const data = await this.makeRequest(endpoint)
      console.log('Messages response:', data)
      
      return data || []
    } catch (error) {
      console.error('Failed to get messages:', error)
      return []
    }
  }

  static async getMessage(email: string, messageId: string): Promise<MailsacMessageContent | null> {
    try {
      const data = await this.makeRequest(`/api/text/${encodeURIComponent(email)}/${messageId}`)
      return data
    } catch (error) {
      console.error('Failed to get message:', error)
      return null
    }
  }

  static async getMessageHTML(email: string, messageId: string): Promise<string | null> {
    try {
      if (!MAILSAC_API_KEY) {
        throw new Error('Mailsac API key not configured')
      }

      const response = await fetch(`${MAILSAC_BASE_URL}/api/body/${encodeURIComponent(email)}/${messageId}`, {
        headers: {
          'Mailsac-Key': MAILSAC_API_KEY,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to get HTML: ${response.status}`)
      }

      return await response.text()
    } catch (error) {
      console.error('Failed to get message HTML:', error)
      return null
    }
  }

  static async getMessageRaw(email: string, messageId: string): Promise<string | null> {
    try {
      if (!MAILSAC_API_KEY) {
        throw new Error('Mailsac API key not configured')
      }

      const response = await fetch(`${MAILSAC_BASE_URL}/api/raw/${encodeURIComponent(email)}/${messageId}`, {
        headers: {
          'Mailsac-Key': MAILSAC_API_KEY,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to get raw message: ${response.status}`)
      }

      return await response.text()
    } catch (error) {
      console.error('Failed to get raw message:', error)
      return null
    }
  }

  static async waitForMessages(
    email: string, 
    timeout: number = 30000,
    interval: number = 5000
  ): Promise<MailsacMessage[]> {
    const startTime = Date.now()
    
    while (Date.now() - startTime < timeout) {
      const messages = await this.getMessages(email)
      if (messages.length > 0) {
        return messages
      }
      
      await new Promise(resolve => setTimeout(resolve, interval))
    }
    
    return []
  }

  static parseEmail(email: string): { login: string; domain: string } {
    const [login, domain] = email.split('@')
    return { login, domain }
  }

  static async checkInboxExists(email: string): Promise<boolean> {
    try {
      const messages = await this.getMessages(email)
      return true // If we can fetch messages, inbox exists (or can be created on-demand)
    } catch (error) {
      return false
    }
  }
}