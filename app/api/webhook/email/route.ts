import { NextRequest, NextResponse } from 'next/server'
import { MessageHandler } from '@/lib/message-handler'
import { headers } from 'next/headers'

// This is a simple webhook implementation for receiving emails
// In production, you'd want to add proper authentication/verification
export async function POST(request: NextRequest) {
  try {
    const headersList = await headers()
    
    // Simple webhook verification - in production, use proper signatures
    const webhookSecret = process.env.WEBHOOK_SECRET
    const authHeader = headersList.get('authorization')
    
    if (webhookSecret && authHeader !== `Bearer ${webhookSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Expected format from email forwarding service
    const {
      to,
      from,
      subject,
      text: textBody,
      html: htmlBody,
      attachments = []
    } = body

    if (!to || !from || !subject || !textBody) {
      return NextResponse.json(
        { error: 'Missing required fields: to, from, subject, text' },
        { status: 400 }
      )
    }

    // Process the incoming message
    await MessageHandler.processIncomingMessage({
      to: to.toLowerCase(),
      from,
      subject,
      textBody,
      htmlBody: htmlBody || undefined,
      attachments: attachments.length > 0 ? attachments : undefined,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Alternative endpoint for ImprovMX-style forwarding
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Email webhook endpoint is active',
    timestamp: new Date().toISOString(),
  })
}