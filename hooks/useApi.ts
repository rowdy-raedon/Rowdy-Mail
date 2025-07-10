import { useState, useCallback } from 'react'
import { toast } from 'sonner'

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface ApiOptions {
  retries?: number
  retryDelay?: number
  showErrorToast?: boolean
}

const defaultOptions: ApiOptions = {
  retries: 3,
  retryDelay: 1000,
  showErrorToast: true
}

export function useApi<T = any>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const call = useCallback(async (
    url: string,
    options: RequestInit = {},
    apiOptions: ApiOptions = {}
  ): Promise<T | null> => {
    const opts = { ...defaultOptions, ...apiOptions }
    
    setState(prev => ({ ...prev, loading: true, error: null }))

    let lastError: Error | null = null
    
    for (let attempt = 0; attempt <= opts.retries!; attempt++) {
      try {
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          ...options,
        })

        if (!response.ok) {
          // Provide more specific error messages based on status codes
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`
          if (response.status >= 500) {
            errorMessage = 'Server error. Please try again later.'
          } else if (response.status === 429) {
            errorMessage = 'Too many requests. Please wait before trying again.'
          } else if (response.status === 404) {
            errorMessage = 'Resource not found.'
          } else if (response.status >= 400) {
            errorMessage = 'Request failed. Please check your input.'
          }
          throw new Error(errorMessage)
        }

        const data = await response.json()
        setState({ data, loading: false, error: null })
        return data
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')
        
        // Don't retry on certain client errors
        if (error instanceof Error && error.message.includes('HTTP 4')) {
          const status = error.message.match(/HTTP (\d+)/)?.[1]
          if (status && ['400', '401', '403', '404'].includes(status)) {
            break // Don't retry client errors
          }
        }
        
        if (attempt < opts.retries!) {
          // Exponential backoff with jitter
          const backoffDelay = opts.retryDelay! * Math.pow(2, attempt) + Math.random() * 1000
          await new Promise(resolve => setTimeout(resolve, Math.min(backoffDelay, 10000)))
        }
      }
    }

    const errorMessage = lastError?.message || 'Request failed'
    setState({ data: null, loading: false, error: errorMessage })
    
    if (opts.showErrorToast) {
      toast.error(`API Error: ${errorMessage}`)
    }
    
    return null
  }, [])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    call,
    reset
  }
}

export function useEmailApi() {
  const api = useApi()

  const generateEmail = useCallback(async () => {
    return api.call('/api/emails', {
      method: 'POST',
      body: JSON.stringify({ action: 'generateEmail' })
    })
  }, [api])

  const getMessages = useCallback(async (email: string) => {
    return api.call('/api/emails', {
      method: 'POST',
      body: JSON.stringify({ action: 'getMessages', email })
    })
  }, [api])

  const getMessage = useCallback(async (email: string, messageId: string) => {
    return api.call('/api/emails', {
      method: 'POST',
      body: JSON.stringify({ action: 'getMessage', email, messageId })
    })
  }, [api])

  return {
    ...api,
    generateEmail,
    getMessages,
    getMessage
  }
}