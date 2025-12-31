'use client'

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardHeader() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname?.startsWith(path)
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-2xl font-bold text-primary-600">
              PromptRouter
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link 
                href="/dashboard" 
                className={`font-medium transition-colors ${
                  isActive('/dashboard') && pathname === '/dashboard'
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/dashboard/requests" 
                className={`font-medium transition-colors ${
                  isActive('/dashboard/requests')
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Requests
              </Link>
              <Link 
                href="/dashboard/settings" 
                className={`font-medium transition-colors ${
                  isActive('/dashboard/settings')
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Settings
              </Link>
            </nav>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  )
}

