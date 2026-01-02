import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Providers } from '@/components/providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PromptRouter - AI Cost Optimizer',
  description: 'Intelligent AI API cost optimizer and prompt router',
}

export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Clerk requires publishableKey during build
  // This must be set in Vercel environment variables
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!publishableKey) {
    // In development, show a helpful error
    if (process.env.NODE_ENV === 'development') {
      console.error(
        '❌ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is missing!\n' +
        'Get your key from: https://dashboard.clerk.com/last-active?path=api-keys\n' +
        'Add it to your .env.local file or Vercel environment variables.'
      )
    }
  }

  return (
    <ClerkProvider publishableKey={publishableKey || ''}>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              `,
            }}
          />
        </head>
        <body className={inter.className}>
          <Providers>
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
