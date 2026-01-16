import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Providers } from '@/components/providers'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PromptRouter - AI Cost Optimizer',
  description: 'Intelligent AI API cost optimizer and prompt router',
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/favicon/apple-touch-icon.png',
  },
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
      <html lang="en" suppressHydrationWarning className={inter.variable}>
        <head>
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-DGMNL50F7M"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-DGMNL50F7M');
              `,
            }}
          />
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
        <body className="font-sans">
          <Providers>
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
