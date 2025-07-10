import { Card, CardContent } from '@/components/ui/card'
import { TempEmail } from '@/types/email'

interface EmailDisplayProps {
  currentEmail: TempEmail | null
  lastRefreshed: Date | null
}

export function EmailDisplay({ currentEmail, lastRefreshed }: EmailDisplayProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  return (
    <Card className="w-full max-w-2xl border-2 shadow-lg">
      <CardContent className="p-8 space-y-6">
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
          
          {lastRefreshed && (
            <p className="text-sm text-muted-foreground font-mono">
              Last refreshed: {formatTime(lastRefreshed)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}