import { Button } from '@/components/ui/button'
import { Copy, X, RefreshCw } from 'lucide-react'
import { Message } from '@/types/email'

interface MessageModalProps {
  message: Message | null
  loadingMessage: boolean
  onClose: () => void
  onCopyToClipboard: (text: string) => void
}

export function MessageModal({ 
  message, 
  loadingMessage, 
  onClose, 
  onCopyToClipboard 
}: MessageModalProps) {
  if (!message) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold truncate">
              {message.subject || 'No Subject'}
            </h2>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>From: {message.from}</span>
              <span>{formatDate(message.date)}</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={onClose}
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
                  {message.textBody || message.body || 'No content available'}
                </pre>
              </div>
              
              {/* Attachments */}
              {message.attachments && message.attachments.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Attachments ({message.attachments.length})</h3>
                  <div className="space-y-1">
                    {message.attachments.map((attachment, index) => (
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
              onClick={() => onCopyToClipboard(message.textBody || message.body || '')}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Content
            </Button>
          </div>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}