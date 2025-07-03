'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, ArrowRight, Zap, Shield, Clock } from 'lucide-react'

export default function HomePage() {
  // Auto-redirect to temp email after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/temp-email'
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-primary">RowdyMail</h1>
          <p className="text-sm text-muted-foreground">Smart Features for Modern Privacy</p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold">
              Temporary Email
              <span className="text-primary"> Service</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Generate temporary email addresses instantly. Perfect for signups, testing, and protecting your privacy.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2" onClick={() => window.location.href = '/temp-email'}>
              <Mail className="h-5 w-5" />
              Get Temporary Email
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Redirecting to temp email service in 3 seconds...
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Instant Generation
              </CardTitle>
              <CardDescription>
                Create temporary email addresses instantly with Mailsac integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No registration required. Get a working email address in seconds.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Privacy Protection
              </CardTitle>
              <CardDescription>
                Keep your real email address private and secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Perfect for signups, testing, and avoiding spam.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Real-time Messages
              </CardTitle>
              <CardDescription>
                Receive and view messages instantly in your browser
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Auto-refresh keeps you updated with new messages.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            RowdyMail - Privacy meets productivity
          </p>
        </div>
      </div>
    </div>
  )
}