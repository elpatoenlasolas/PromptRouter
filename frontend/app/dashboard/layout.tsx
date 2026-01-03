import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import SimpleFooter from '@/components/SimpleFooter'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-base flex flex-col">
      <DashboardHeader />
      <DashboardSidebar />
      <main className="md:ml-64 pt-16 flex-1">
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
      <div className="md:ml-64">
        <SimpleFooter />
      </div>
    </div>
  )
}
