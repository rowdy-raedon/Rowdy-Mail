import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, ArrowRight, Zap, Shield, Clock } from 'lucide-react'
import Link from 'next/link'

function HomePageContent() {
  return (
    <>
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
            <Link href="/temp-email">
              <Button size="lg" className="gap-2">
                <Mail className="h-5 w-5" />
                Get Temporary Email
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
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
    </>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }>
        <HomePageContent />
      </Suspense>
    </div>
  )
}