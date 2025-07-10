import { NextRequest, NextResponse } from 'next/server'
import { MailsacAPI } from '@/lib/mailsac-api'
import { EmailApiRequest } from '@/types/email'

// Validation functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidAction(action: string): action is EmailApiRequest['action'] {
  return ['getMessages', 'getMessage', 'generateEmail'].includes(action)
}

function createErrorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status })
}

export async function POST(request: NextRequest) {
  try {
    let body: any
    
    // Parse JSON body with error handling
    try {
      body = await request.json()
    } catch (error) {
      return createErrorResponse('Invalid JSON in request body')
    }
    
    const { action, email, messageId } = body
    
    // Validate action
    if (!action || !isValidAction(action)) {
      return createErrorResponse('Valid action is required (getMessages, getMessage, generateEmail)')
    }
    
    switch (action) {
      case 'getMessages':
        if (!email) {
          return createErrorResponse('Email is required for getMessages action')
        }
        if (!isValidEmail(email)) {
          return createErrorResponse('Invalid email format')
        }
        
        const messages = await MailsacAPI.getMessages(email)
        return NextResponse.json(messages)
      
      case 'getMessage':
        if (!email || !messageId) {
          return createErrorResponse('Email and messageId are required for getMessage action')
        }
        if (!isValidEmail(email)) {
          return createErrorResponse('Invalid email format')
        }
        if (typeof messageId !== 'string' || messageId.trim() === '') {
          return createErrorResponse('Valid messageId is required')
        }
        
        const messageContent = await MailsacAPI.getMessage(email, messageId)
        return NextResponse.json(messageContent)
      
      case 'generateEmail':
        const newEmail = MailsacAPI.generateRandomEmail()
        return NextResponse.json({ email: newEmail })
      
      default:
        return createErrorResponse('Invalid action')
    }
  } catch (error) {
    console.error('API Error:', error)
    
    // Return different error messages based on error type
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Server error: ${error.message}` },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    
    if (!email) {
      return createErrorResponse('Email parameter is required')
    }
    
    if (!isValidEmail(email)) {
      return createErrorResponse('Invalid email format')
    }
    
    const messages = await MailsacAPI.getMessages(email)
    return NextResponse.json(messages)
  } catch (error) {
    console.error('API Error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Server error: ${error.message}` },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}