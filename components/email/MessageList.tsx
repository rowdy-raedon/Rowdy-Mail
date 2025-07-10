import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mail, Eye, RefreshCw } from 'lucide-react'
import { TempEmail, Message } from '@/types/email'

interface MessageListProps {
  currentEmail: TempEmail | null
  onOpenMessage: (message: Message) => void
}

export function MessageList({ currentEmail, onOpenMessage }: MessageListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
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
              onClick={() => onOpenMessage(message)}
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
  )
}