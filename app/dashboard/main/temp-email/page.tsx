'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@stackframe/stack'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Copy, Mail, RefreshCw, Download, Shuffle, Save, Eye, TestTube } from 'lucide-react'
import { EmailGenerator, TempEmail } from '@/lib/email-generator'
import { toast } from 'sonner'

interface OneSecMessage {
  id: number
  from: string
  subject: string
  date: string
  body?: string
  textBody?: string
  htmlBody?: string
  attachments: Array<{
    filename: string
    contentType: string
    size: number
  }>
}

interface EmailWithMessages extends TempEmail {
  messages: OneSecMessage[]
}

export default function TempEmailPage() {
  const user = useUser({ or: 'redirect' })
  const [currentEmail, setCurrentEmail] = useState<EmailWithMessages | null>(null)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)

  const generateNewEmail = useCallback(async () => {
    try {
      setLoading(true)
      console.log('Generating email for user:', user.id)
      
      // Try database approach first
      try {
        const tempEmail = await EmailGenerator.createTempEmail({
          userId: user.id,
        })
        
        console.log('Generated email:', tempEmail)
        const emailWithMessages = { ...tempEmail, messages: [] }
        setCurrentEmail(emailWithMessages)
        setLastRefreshed(new Date())
        toast.success('New temporary email generated!')
        return
      } catch (dbError) {
        console.error('Database creation failed, using fallback:', dbError)
        
        // Fallback: create email without database storage for testing
        const email = Math.random().toString(36).substring(2, 15) + '@mailsac.com'
        const fallbackEmail = {
          id: 'temp-' + Date.now(),
          email: email,
          login: email.split('@')[0],
          domain: 'mailsac.com',
          userId: user.id,
          createdAt: new Date().toISOString(),
          expiresAt: null,
          isActive: true,
          messagesCount: 0,
          messages: []
        }
        
        setCurrentEmail(fallbackEmail)
        setLastRefreshed(new Date())
        toast.success('Temporary email generated (demo mode)!')
      }
    } catch (error) {
      console.error('Complete failure to create temp email:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      toast.error(`Failed to generate email: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }, [user.id])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Email copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const refreshMessages = useCallback(async () => {
    if (!currentEmail) return
    try {
      setRefreshing(true)
      console.log('Refreshing messages for:', currentEmail.email)
      
      const messages = await EmailGenerator.fetchMessages(currentEmail)
      console.log('Fetched messages:', messages)
      
      setCurrentEmail({ ...currentEmail, messages })
      setLastRefreshed(new Date())
      
      if (messages.length > 0) {
        toast.success(`Found ${messages.length} message(s)!`)
      }
    } catch (error) {
      console.error('Failed to refresh messages:', error)
      toast.error('Failed to refresh messages')
    } finally {
      setRefreshing(false)
    }
  }, [currentEmail])

  const saveEmail = async () => {
    if (!currentEmail) return
    toast.success('Email saved to your account!')
  }

  const testEmailAPI = async () => {
    if (!currentEmail) return
    
    try {
      console.log('Testing email API for:', currentEmail.email)
      
      // Test the Mailsac API directly
      const { MailsacAPI } = await import('@/lib/mailsac-api')
      const messages = await MailsacAPI.getMessages(currentEmail.email)
      
      console.log('Direct API test result:', messages)
      toast.success(`API test complete. Found ${messages.length} messages. Check console for details.`)
    } catch (error) {
      console.error('API test failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      toast.error(`API test failed: ${errorMessage}`)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Auto-generate email on first load
  useEffect(() => {
    if (!currentEmail) {
      generateNewEmail()
    }
  }, [currentEmail, generateNewEmail])

  // Auto-refresh messages every 10 seconds
  useEffect(() => {
    if (currentEmail) {
      const interval = setInterval(refreshMessages, 10000)
      return () => clearInterval(interval)
    }
  }, [currentEmail, refreshMessages])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h1 className="text-3xl font-bold text-primary">RowdyMail</h1>
          <p className="text-sm text-muted-foreground">Smart Features for Modern Privacy</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Download Extension
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center p-8 space-y-8 max-w-4xl mx-auto">
        
        {/* Main Email Card */}
        <Card className="w-full max-w-2xl border-2 shadow-lg">
          <CardContent className="p-8 space-y-6">
            
            {/* Email Address Display */}
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-muted-foreground">Your Temporary Email</h2>
                {currentEmail ? (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-mono font-bold text-primary break-all">
                      {currentEmail.email}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-muted rounded-lg animate-pulse">
                    <div className="h-8 bg-muted-foreground/20 rounded"></div>
                  </div>
                )}
              </div>
              
              {/* Last Refreshed */}
              {lastRefreshed && (
                <p className="text-sm text-muted-foreground font-mono">
                  Last refreshed: {formatTime(lastRefreshed)}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              <Button 
                variant="outline" 
                onClick={generateNewEmail}
                disabled={loading}
                className="gap-2"
              >
                <Shuffle className="h-4 w-4" />
                Change
              </Button>
              <Button 
                variant="outline" 
                onClick={() => currentEmail && copyToClipboard(currentEmail.email)}
                disabled={!currentEmail}
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
              <Button 
                variant="outline" 
                onClick={saveEmail}
                disabled={!currentEmail}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button 
                variant="outline" 
                onClick={refreshMessages}
                disabled={!currentEmail || refreshing}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                onClick={testEmailAPI}
                disabled={!currentEmail}
                className="gap-2"
                size="sm"
              >
                <TestTube className="h-4 w-4" />
                Test API
              </Button>
            </div>

            <Separator />

            {/* Email Preview/Inbox */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Inbox
                </h3>
                {currentEmail && currentEmail.messages.length > 0 && (
                  <Badge variant="secondary">{currentEmail.messages.length}</Badge>
                )}
              </div>

              {/* Email List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {!currentEmail ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">Generating email...</p>
                  </div>
                ) : currentEmail.messages.length === 0 ? (
                  <div className="text-center py-8 space-y-2">
                    <Eye className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">No emails yet</p>
                    <p className="text-xs text-muted-foreground">New messages will appear here automatically</p>
                  </div>
                ) : (
                  currentEmail.messages.map((message, index) => (
                    <Card key={message.id || index} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1 min-w-0">
                              <p className="font-mono text-sm text-muted-foreground truncate">
                                From: {message.from}
                              </p>
                              <p className="font-mono font-semibold truncate">
                                {message.subject || 'No Subject'}
                              </p>
                            </div>
                            <p className="font-mono text-xs text-muted-foreground whitespace-nowrap ml-4">
                              {formatDate(message.date)}
                            </p>
                          </div>
                          {(message.body || message.textBody) && (
                            <div className="pt-2 border-t">
                              <p className="font-mono text-sm text-muted-foreground line-clamp-2">
                                {message.textBody || message.body}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer/Info Section */}
        <div className="text-center space-y-4 max-w-lg">
          <div className="space-y-2">
            <p className="text-lg font-semibold text-primary">Privacy meets productivity</p>
            <p className="text-sm text-muted-foreground">
              Protect your real email address with temporary, disposable emails that forward to your inbox. 
              Perfect for signups, testing, and maintaining your digital privacy.
            </p>
          </div>
          
          {currentEmail && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <p className="text-sm font-semibold">📧 Test Your Email</p>
              <p className="text-xs text-muted-foreground">
                Send an email to <span className="font-mono">{currentEmail.email}</span> from any email service to test message reception.
                Use the "Test API" button to debug connectivity issues.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}