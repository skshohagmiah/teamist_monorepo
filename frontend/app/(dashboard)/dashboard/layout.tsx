import { DashboardHeader } from "./components/dashboard-header"
import { DashboardSidebar } from "./components/dashboard-sidebar"


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}

