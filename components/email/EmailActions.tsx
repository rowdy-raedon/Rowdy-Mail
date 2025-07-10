import { Button } from '@/components/ui/button'
import { Copy, Shuffle, Save, RefreshCw } from 'lucide-react'
import { TempEmail } from '@/types/email'

interface EmailActionsProps {
  currentEmail: TempEmail | null
  loading: boolean
  refreshing: boolean
  isOnline?: boolean
  onGenerateNewEmail: () => void
  onCopyToClipboard: (text: string) => void
  onSaveEmail: () => void
  onRefreshMessages: () => void
}

export function EmailActions({ 
  currentEmail, 
  loading, 
  refreshing,
  isOnline = true,
  onGenerateNewEmail,
  onCopyToClipboard,
  onSaveEmail,
  onRefreshMessages
}: EmailActionsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Button 
        variant="outline" 
        onClick={onGenerateNewEmail}
        disabled={loading || !isOnline}
        className="gap-2"
      >
        <Shuffle className="h-4 w-4" />
        Change
      </Button>
      <Button 
        variant="outline" 
        onClick={() => currentEmail && onCopyToClipboard(currentEmail.email)}
        disabled={!currentEmail}
        className="gap-2"
      >
        <Copy className="h-4 w-4" />
        Copy
      </Button>
      <Button 
        variant="outline" 
        onClick={onSaveEmail}
        disabled={!currentEmail}
        className="gap-2"
      >
        <Save className="h-4 w-4" />
        Save
      </Button>
      <Button 
        variant="outline" 
        onClick={onRefreshMessages}
        disabled={!currentEmail || refreshing || !isOnline}
        className="gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  )
}