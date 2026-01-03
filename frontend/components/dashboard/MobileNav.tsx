'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, Menu } from 'lucide-react'
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Settings,
  Zap
} from 'lucide-react'
import { useUser } from '@clerk/nextjs'

const dashboardNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Playground', href: '/dashboard/playground', icon: Zap },
  { name: 'Requests', href: '/dashboard/requests', icon: FileText },
  { name: 'Usage', href: '/dashboard/usage', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

const publicNavigation = [
  { name: 'Pricing', href: '/pricing' },
  { name: 'Docs', href: '/docs' },
  { name: 'Sign In', href: '/sign-in' },
  { name: 'Sign Up', href: '/sign-up' },
]

export default function MobileNav({ publicOnly }: { publicOnly?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { isLoaded, isSignedIn } = useUser()

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const isActive = (href: string) => {
    if (!href) return false
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname?.startsWith(href)
  }

  return (
    <>
      {/* Hamburger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className="md:hidden bg-white dark:bg-gray-800 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-50"
        aria-label="Toggle navigation menu"
      >
        <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-dark-surface shadow dark:shadow-gray-900-xl z-50 md:hidden
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="/images/logo.svg" 
              alt="PromptRouter" 
              className="h-7 w-auto dark:hidden"
            />
            <img 
              src="/images/logo-white.svg" 
              alt="PromptRouter" 
              className="h-7 w-auto hidden dark:block"
            />
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {((isLoaded && isSignedIn) || !publicOnly)
            ? dashboardNavigation.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all
                      ${active
                        ? 'bg-gray-100 text-gray-700'
                        : 'text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-border'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 mr-3 ${active ? 'text-gray-600' : 'text-gray-400'}`} />
                    {item.name}
                  </Link>
                )
              })
            : publicNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-border"
                >
                  {item.name}
                </Link>
              ))}
        </nav>
      </aside>
    </>
  )
}
