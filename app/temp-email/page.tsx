'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Copy, Mail, RefreshCw, Download, Shuffle, Save, Eye, TestTube, X } from 'lucide-react'
import { toast } from 'sonner'

interface Message {
  id: number | string
  from: string
  subject: string
  date: string
  body?: string
  textBody?: string
  htmlBody?: string
  attachments: any[]
}

interface TempEmail {
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

export default function TempEmailPage() {
  const [currentEmail, setCurrentEmail] = useState<TempEmail | null>(null)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [loadingMessage, setLoadingMessage] = useState(false)

  const generateNewEmail = useCallback(async () => {
    try {
      setLoading(true)
      console.log('Generating new email...')
      
      // Generate email address
      const email = Math.random().toString(36).substring(2, 15) + '@mailsac.com'
      const newEmail: TempEmail = {
        id: 'temp-' + Date.now(),
        email: email,
        login: email.split('@')[0],
        domain: 'mailsac.com',
        userId: 'demo-user',
        createdAt: new Date().toISOString(),
        expiresAt: null,
        isActive: true,
        messagesCount: 0,
        messages: []
      }
      
      setCurrentEmail(newEmail)
      setLastRefreshed(new Date())
      toast.success('Temporary email generated!')
      
    } catch (error) {
      console.error('Failed to create temp email:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      toast.error(`Failed to generate email: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }, [])

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
      
      // Simple fetch to Mailsac API
      const apiKey = 'k_orTxHGFHe5LwWe2rga6ucez8WroPUD013DEn'
      const response = await fetch(`https://mailsac.com/api/addresses/${encodeURIComponent(currentEmail.email)}/messages`, {
        headers: {
          'Mailsac-Key': apiKey,
        },
      })
      
      if (response.ok) {
        const messages = await response.json()
        console.log('Fetched messages:', messages)
        
        const formattedMessages = messages.map((msg: any, index: number) => ({
          id: msg._id || index,
          from: msg.from?.[0]?.address || msg.from || 'Unknown',
          subject: msg.subject || 'No Subject',
          date: msg.received || new Date().toISOString(),
          body: '',
          textBody: '',
          htmlBody: '',
          attachments: msg.attachments || [],
        }))
        
        setCurrentEmail({ ...currentEmail, messages: formattedMessages })
        setLastRefreshed(new Date())
        
        if (formattedMessages.length > 0) {
          toast.success(`Found ${formattedMessages.length} message(s)!`)
        }
      } else {
        console.error('API response not ok:', response.status)
        toast.error(`API Error: ${response.status}`)
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

  const fetchMessageContent = async (messageId: string) => {
    if (!currentEmail) return null
    
    try {
      setLoadingMessage(true)
      console.log('Fetching message content for:', messageId)
      
      const apiKey = 'k_orTxHGFHe5LwWe2rga6ucez8WroPUD013DEn'
      const response = await fetch(`https://mailsac.com/api/text/${encodeURIComponent(currentEmail.email)}/${messageId}`, {
        headers: {
          'Mailsac-Key': apiKey,
        },
      })
      
      if (response.ok) {
        const content = await response.text()
        console.log('Fetched message content:', content)
        return content
      } else {
        console.error('Failed to fetch message content:', response.status)
        toast.error('Failed to load message content')
        return null
      }
    } catch (error) {
      console.error('Error fetching message content:', error)
      toast.error('Failed to load message content')
      return null
    } finally {
      setLoadingMessage(false)
    }
  }

  const openMessage = async (message: Message) => {
    const content = await fetchMessageContent(message.id.toString())
    setSelectedMessage({
      ...message,
      textBody: content || message.textBody || 'No content available'
    })
  }

  const testEmailAPI = async () => {
    if (!currentEmail) return
    
    try {
      console.log('Testing email API for:', currentEmail.email)
      
      // Direct API test
      const apiKey = 'k_orTxHGFHe5LwWe2rga6ucez8WroPUD013DEn'
      const response = await fetch(`https://mailsac.com/api/addresses/${encodeURIComponent(currentEmail.email)}/messages`, {
        headers: {
          'Mailsac-Key': apiKey,
        },
      })
      
      console.log('API Response Status:', response.status)
      console.log('API Response Headers:', Object.fromEntries(response.headers.entries()))
      
      if (response.ok) {
        const data = await response.json()
        console.log('API Response Data:', data)
        toast.success(`API test successful! Found ${data.length} messages. Check console for details.`)
      } else {
        const errorText = await response.text()
        console.error('API Error:', errorText)
        toast.error(`API test failed: ${response.status} - ${errorText}`)
      }
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
                    <Card 
                      key={message.id || index} 
                      className="border-l-4 border-l-primary cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => openMessage(message)}
                    >
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
                          <div className="flex justify-end pt-2">
                            <p className="text-xs text-muted-foreground hover:text-primary">
                              Click to view full message →
                            </p>
                          </div>
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
                Use the &quot;Test API&quot; button to debug connectivity issues.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold truncate">
                  {selectedMessage.subject || 'No Subject'}
                </h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>From: {selectedMessage.from}</span>
                  <span>{formatDate(selectedMessage.date)}</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setSelectedMessage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {loadingMessage ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading message content...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Message Content */}
                  <div className="bg-muted rounded-lg p-4">
                    <pre className="whitespace-pre-wrap font-mono text-sm break-words">
                      {selectedMessage.textBody || selectedMessage.body || 'No content available'}
                    </pre>
                  </div>
                  
                  {/* Attachments */}
                  {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold">Attachments ({selectedMessage.attachments.length})</h3>
                      <div className="space-y-1">
                        {selectedMessage.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded text-sm">
                            <span className="font-mono">{attachment.filename || `Attachment ${index + 1}`}</span>
                            {attachment.size && (
                              <span className="text-muted-foreground">({attachment.size} bytes)</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => copyToClipboard(selectedMessage.textBody || selectedMessage.body || '')}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Content
                </Button>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setSelectedMessage(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}