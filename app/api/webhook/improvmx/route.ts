import { NextRequest, NextResponse } from 'next/server'
import { MessageHandler } from '@/lib/message-handler'

// ImprovMX webhook handler
// ImprovMX sends emails in a specific format
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // ImprovMX sends form data
    const to = formData.get('to') as string
    const from = formData.get('from') as string
    const subject = formData.get('subject') as string
    const text = formData.get('text') as string
    const html = formData.get('html') as string
    
    // Handle attachments if present
    const attachments = []
    let attachmentIndex = 0
    
    while (formData.get(`attachment-${attachmentIndex}`)) {
      const attachment = formData.get(`attachment-${attachmentIndex}`) as File
      const attachmentName = formData.get(`attachment-${attachmentIndex}-name`) as string
      
      if (attachment && attachmentName) {
        const buffer = await attachment.arrayBuffer()
        const base64Content = Buffer.from(buffer).toString('base64')
        
        attachments.push({
          filename: attachmentName,
          contentType: attachment.type,
          size: attachment.size,
          content: base64Content,
        })
      }
      
      attachmentIndex++
    }

    if (!to || !from || !subject || !text) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Process the incoming message
    await MessageHandler.processIncomingMessage({
      to: to.toLowerCase(),
      from,
      subject,
      textBody: text,
      htmlBody: html || undefined,
      attachments: attachments.length > 0 ? attachments : undefined,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('ImprovMX webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'ImprovMX webhook endpoint is active',
    timestamp: new Date().toISOString(),
  })
}