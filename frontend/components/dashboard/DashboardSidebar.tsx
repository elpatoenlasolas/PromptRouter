'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Settings,
  Zap,
  BookOpen,
  Book
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Playground', href: '/dashboard/playground', icon: Zap },
  { name: 'Requests', href: '/dashboard/requests', icon: FileText },
  { name: 'Usage', href: '/dashboard/usage', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Docs', href: '/docs', icon: BookOpen },
]

export default function DashboardSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname?.startsWith(href)
  }

  return (
    <aside className="hidden md:block w-64 bg-white dark:bg-dark-surface shadow-sm dark:shadow-gray-900 min-h-screen fixed left-0 top-16">
      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all
                ${
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 dark:text-dark-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-border'
                }
              `}
            >
              <Icon className={`w-5 h-5 mr-3 ${active ? 'text-primary' : 'text-gray-400 dark:text-dark-text-muted'}`} />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

