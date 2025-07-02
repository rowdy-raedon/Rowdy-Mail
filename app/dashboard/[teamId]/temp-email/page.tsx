'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@stackframe/stack'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Copy, Mail, Plus, Trash2, RefreshCw, Clock, MessageCircle } from 'lucide-react'
import { EmailGenerator, TempEmail } from '@/lib/email-generator'
import { MessageHandler, Message } from '@/lib/message-handler'
import { toast } from 'sonner'

interface EmailWithMessages extends TempEmail {
  messages: Message[]
}

export default function TempEmailPage() {
  const user = useUser({ or: 'redirect' })
  const params = useParams<{ teamId: string }>()
  const [tempEmails, setTempEmails] = useState<EmailWithMessages[]>([])
  const [selectedEmail, setSelectedEmail] = useState<EmailWithMessages | null>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [prefix, setPrefix] = useState('')
  const [expiresIn, setExpiresIn] = useState(24)

  const loadTempEmails = useCallback(async () => {
    try {
      setLoading(true)
      const emails = await EmailGenerator.getTempEmails(user.id)
      const emailsWithMessages = await Promise.all(
        emails.map(async (email) => {
          const messages = await MessageHandler.getMessages(email.id)
          return { ...email, messages }
        })
      )
      setTempEmails(emailsWithMessages)
    } catch (error) {
      console.error('Failed to load temp emails:', error)
      toast.error('Failed to load temp emails')
    } finally {
      setLoading(false)
    }
  }, [user.id])

  const createTempEmail = async () => {
    try {
      setCreating(true)
      const tempEmail = await EmailGenerator.createTempEmail({
        userId: user.id,
        teamId: params.teamId,
        prefix: prefix || undefined,
        expiresIn: expiresIn > 0 ? expiresIn : undefined,
      })
      const emailWithMessages = { ...tempEmail, messages: [] }
      setTempEmails(prev => [emailWithMessages, ...prev])
      setPrefix('')
      toast.success('Temporary email created!')
    } catch (error) {
      console.error('Failed to create temp email:', error)
      toast.error('Failed to create temp email')
    } finally {
      setCreating(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const deactivateEmail = async (emailId: string) => {
    try {
      await EmailGenerator.deactivateEmail(emailId, user.id)
      setTempEmails(prev => prev.filter(email => email.id !== emailId))
      if (selectedEmail?.id === emailId) {
        setSelectedEmail(null)
      }
      toast.success('Email deactivated')
    } catch (error) {
      console.error('Failed to deactivate email:', error)
      toast.error('Failed to deactivate email')
    }
  }

  const markAsRead = async (messageId: string) => {
    try {
      await MessageHandler.markAsRead(messageId)
      setTempEmails(prev => prev.map(email => ({
        ...email,
        messages: email.messages.map(msg => 
          msg.id === messageId ? { ...msg, isRead: true } : msg
        )
      })))
      if (selectedEmail) {
        setSelectedEmail(prev => prev ? {
          ...prev,
          messages: prev.messages.map(msg => 
            msg.id === messageId ? { ...msg, isRead: true } : msg
          )
        } : null)
      }
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getTimeLeft = (expiresAt: string | null) => {
    if (!expiresAt) return 'Never expires'
    const now = new Date()
    const expires = new Date(expiresAt)
    const diff = expires.getTime() - now.getTime()
    if (diff <= 0) return 'Expired'
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m left`
  }

  useEffect(() => {
    loadTempEmails()
    const interval = setInterval(loadTempEmails, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [user.id, loadTempEmails])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Temporary Email Service</h1>
        <p className="text-muted-foreground">
          Generate temporary email addresses for testing and temporary use.
        </p>
      </div>

      {/* Create New Email Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Temporary Email
          </CardTitle>
          <CardDescription>
            Generate a new temporary email address using your custom domain.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prefix">Prefix (optional)</Label>
              <Input
                id="prefix"
                placeholder="e.g., test, signup"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expires">Expires in (hours, 0 = never)</Label>
              <Input
                id="expires"
                type="number"
                min="0"
                value={expiresIn}
                onChange={(e) => setExpiresIn(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={createTempEmail} 
                disabled={creating}
                className="w-full"
              >
                {creating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Create Email
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Temporary Emails</h2>
            <Button variant="outline" size="sm" onClick={loadTempEmails} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {loading ? (
            <Card>
              <CardContent className="flex items-center justify-center p-6">
                <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                Loading emails...
              </CardContent>
            </Card>
          ) : tempEmails.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Mail className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-lg font-medium">No temporary emails yet</p>
                <p className="text-sm text-muted-foreground">Create your first temporary email above</p>
              </CardContent>
            </Card>
          ) : (
            tempEmails.map((email) => (
              <Card 
                key={email.id} 
                className={`cursor-pointer transition-colors ${
                  selectedEmail?.id === email.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedEmail(email)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-mono text-sm font-medium truncate">
                          {email.email}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            copyToClipboard(email.email)
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {email.messagesCount} messages
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {getTimeLeft(email.expiresAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {email.messagesCount > 0 && (
                        <Badge variant="secondary">{email.messagesCount}</Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          deactivateEmail(email.id)
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          ))}
        </div>

        {/* Message View */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            {selectedEmail ? `Messages for ${selectedEmail.email}` : 'Select an email to view messages'}
          </h2>

          {selectedEmail ? (
            selectedEmail.messages.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-lg font-medium">No messages yet</p>
                  <p className="text-sm text-muted-foreground">
                    Messages sent to {selectedEmail.email} will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {selectedEmail.messages.map((message) => (
                  <Card key={message.id} className={`${!message.isRead ? 'border-primary/50' : ''}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base truncate">{message.subject}</CardTitle>
                          <CardDescription className="text-xs">
                            From: {message.fromEmail} • {formatDate(message.receivedAt)}
                          </CardDescription>
                        </div>
                        {!message.isRead && (
                          <Badge variant="default" className="ml-2">New</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div 
                        className="prose prose-sm dark:prose-invert max-w-none"
                        onClick={() => !message.isRead && markAsRead(message.id)}
                      >
                        {message.bodyHtml ? (
                          <div dangerouslySetInnerHTML={{ __html: message.bodyHtml }} />
                        ) : (
                          <p className="whitespace-pre-wrap">{message.bodyText}</p>
                        )}
                      </div>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm font-medium mb-2">Attachments:</p>
                          <div className="space-y-1">
                            {message.attachments.map((attachment: any, index: number) => (
                              <div key={index} className="text-xs text-muted-foreground">
                                📎 {attachment.filename} ({attachment.size} bytes)
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Mail className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-lg font-medium">Select an email</p>
                <p className="text-sm text-muted-foreground">
                  Choose a temporary email from the list to view its messages
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}