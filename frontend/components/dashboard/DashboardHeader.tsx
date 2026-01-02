'use client'

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { LayoutDashboard, Settings, BarChart3, CreditCard, User, BookOpen, X } from 'lucide-react'

export default function DashboardHeader() {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    { name: 'Usage', href: '/dashboard/usage', icon: BarChart3 },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Docs', href: '/docs', icon: BookOpen },
    { name: 'Pricing', href: '/pricing', icon: CreditCard },
  ]

  return (
    <header className="bg-gradient-to-r from-primary-50 to-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 h-16">
      <div className="h-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-full">
          <Link href="/dashboard" className="text-2xl font-bold text-primary-600">
            PromptRouter
          </Link>
          <div className="flex items-center gap-2 relative" ref={menuRef}>
            {/* UserButton with integrated menu */}
            <div className="relative">
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                    userButtonPopoverCard: "shadow-lg border border-gray-200 rounded-lg",
                    userButtonPopoverActionButton: "hover:bg-primary-50",
                    userButtonPopoverActionButtonText: "text-gray-700",
                  }
                }}
              />
              
              {/* Custom Menu Overlay - appears on click */}
              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setShowMenu(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 transition-colors"
                      >
                        <Icon className="w-4 h-4 mr-3 text-primary-600" />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Quick Access Menu Button */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg hover:bg-primary-50 transition-colors relative"
              aria-label="Quick menu"
            >
              <svg
                className="w-5 h-5 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

