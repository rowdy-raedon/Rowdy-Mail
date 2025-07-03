'use client';

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8 max-w-md">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-muted-foreground mb-4">
              Please try refreshing the page or accessing the temporary email service directly.
            </p>
            <div className="space-y-2">
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 mr-2"
              >
                Refresh Page
              </button>
              <a 
                href="/temp-email"
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 inline-block"
              >
                Go to Temp Email
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function Provider(props: { children?: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="dark">
        {props.children}
        <Toaster richColors theme="dark" />
      </ThemeProvider>
    </ErrorBoundary>
  );
}