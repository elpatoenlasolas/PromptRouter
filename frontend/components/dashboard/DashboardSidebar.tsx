'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Settings,
  Zap
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
    <aside className="hidden md:block w-64 bg-white shadow-sm min-h-screen fixed left-0 top-16">
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
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <Icon className={`w-5 h-5 mr-3 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

