/**
 * API helper that automatically includes Clerk authentication
 * Use this in client components that need to make authenticated requests
 */

import { useAuth } from '@clerk/nextjs'

export function useAuthenticatedFetch() {
  const { getToken } = useAuth()

  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    const token = await getToken()
    
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    })
  }

  return { authenticatedFetch }
}

/**
 * Simple wrapper for making authenticated API calls
 */
export async function makeAuthenticatedRequest<T>(
  endpoint: string,
  getToken: () => Promise<string | null>,
  options: RequestInit = {}
): Promise<T> {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  const token = await getToken()
  
  console.log('🔑 Clerk token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN')
  
  const response = await fetch(`${baseURL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ 
      detail: `HTTP ${response.status}: ${response.statusText}` 
    }))
    throw new Error(error.detail || `Request failed with status ${response.status}`)
  }

  return response.json()
}
