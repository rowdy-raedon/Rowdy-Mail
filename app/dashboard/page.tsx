'use client'

import { useEffect } from 'react'

export default function Dashboard() {
  useEffect(() => {
    window.location.href = '/temp-email'
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to RowdyMail...</h1>
        <p className="text-muted-foreground">Taking you to the temporary email service.</p>
      </div>
    </div>
  )
}
