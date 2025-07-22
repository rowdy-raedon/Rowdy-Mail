'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { TempEmail, Message, MailsacApiMessage } from '@/types/email'
import { EmailDisplay } from '@/components/email/EmailDisplay'
import { EmailActions } from '@/components/email/EmailActions'
import { MessageList } from '@/components/email/MessageList'
import { MessageModal } from '@/components/email/MessageModal'
import { useEmailApi } from '@/hooks/useApi'

export default function TempEmailPage() {
  const [currentEmail, setCurrentEmail] = useState<TempEmail | null>(null)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [loadingMessage, setLoadingMessage] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true)

  const emailApi = useEmailApi()

  const generateNewEmail = useCallback(async () => {
    try {
      setLoading(true)
      console.log('Generating new email...')
      
      const data = await emailApi.generateEmail()
      
      if (data) {
        const newEmail: TempEmail = {
          id: 'temp-' + Date.now(),
          email: data.email,
          login: data.email.split('@')[0],
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
      }
    } catch (error) {
      console.error('Failed to create temp email:', error)
      // Error toast is already handled by useApi hook
    } finally {
      setLoading(false)
    }
  }, [emailApi.generateEmail])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const refreshMessages = useCallback(async () => {
    if (!currentEmail) return
    try {
      setRefreshing(true)
      console.log('Refreshing messages for:', currentEmail.email)
      
      const messages = await emailApi.getMessages(currentEmail.email)
      
      if (messages) {
        console.log('Fetched messages:', messages)
        
        const formattedMessages = messages.map((msg: MailsacApiMessage, index: number) => ({
          id: msg._id || index,
          from: Array.isArray(msg.from) ? msg.from[0]?.address : msg.from || 'Unknown',
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
      }
    } catch (error) {
      console.error('Failed to refresh messages:', error)
      // Error toast is already handled by useApi hook
    } finally {
      setRefreshing(false)
    }
  }, [currentEmail, emailApi.getMessages])

  const saveEmail = async () => {
    if (!currentEmail) return
    toast.success('Email saved to your account!')
  }

  const fetchMessageContent = async (messageId: string) => {
    if (!currentEmail) return null
    
    try {
      setLoadingMessage(true)
      console.log('Fetching message content for:', messageId)
      
      const content = await emailApi.getMessage(currentEmail.email, messageId)
      
      if (content) {
        console.log('Fetched message content:', content)
        return content
      }
      
      return null
    } catch (error) {
      console.error('Error fetching message content:', error)
      // Error toast is already handled by useApi hook
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

  // Auto-generate email on first load
  useEffect(() => {
    let mounted = true
    if (!currentEmail) {
      generateNewEmail().then(() => {
        if (!mounted) return
        // Email generated successfully
      }).catch(() => {
        if (!mounted) return
        // Error already handled by useApi hook
      })
    }
    return () => {
      mounted = false
    }
  }, []) // Remove dependencies to prevent infinite loop

  // Track page visibility to pause polling when tab is not active
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Track online status to pause polling when offline
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Auto-refresh messages every 30 seconds (reduced frequency for better performance)
  // Only poll when page is visible and online to save resources
  useEffect(() => {
    if (currentEmail && isVisible && isOnline) {
      const interval = setInterval(refreshMessages, 30000)
      return () => clearInterval(interval)
    }
  }, [currentEmail, isVisible, isOnline, refreshMessages])

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
        
        {/* Connection Status */}
        {!isOnline && (
          <div className="text-center p-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg text-sm">
            Offline - Auto-refresh paused
          </div>
        )}
        {isOnline && !isVisible && (
          <div className="text-center p-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm">
            Auto-refresh paused (tab not active)
          </div>
        )}

        {/* Email Display */}
        <EmailDisplay 
          currentEmail={currentEmail}
          lastRefreshed={lastRefreshed}
        />
        
        {/* Action Buttons */}
        <EmailActions 
          currentEmail={currentEmail}
          loading={loading}
          refreshing={refreshing}
          isOnline={isOnline}
          onGenerateNewEmail={generateNewEmail}
          onCopyToClipboard={copyToClipboard}
          onSaveEmail={saveEmail}
          onRefreshMessages={refreshMessages}
        />

        <Separator className="max-w-2xl" />

        {/* Message List */}
        <div className="w-full max-w-2xl">
          <MessageList 
            currentEmail={currentEmail}
            onOpenMessage={openMessage}
          />
        </div>

        {/* Footer/Info Section */}
        <div className="text-center space-y-4 max-w-lg">
          <div className="space-y-2">
            <p className="text-lg font-semibold text-primary">Privacy meets productivity</p>
            <p className="text-sm text-muted-foreground">
              Protect your real email address with temporary, disposable emails that forward to your inbox. 
              Perfect for signups, testing, and maintaining your digital privacy.
            </p>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      <MessageModal 
        message={selectedMessage}
        loadingMessage={loadingMessage}
        onClose={() => setSelectedMessage(null)}
        onCopyToClipboard={copyToClipboard}
      />
    </div>
  )
}