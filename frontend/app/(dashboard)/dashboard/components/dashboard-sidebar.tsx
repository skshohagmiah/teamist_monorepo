'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CheckSquare, MessageSquare, Calendar, FileText, Image, Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const sidebarItems = [
  { name: 'Tasks', icon: CheckSquare, href: '/dashboard/tasks' },
  { name: 'Chats', icon: MessageSquare, href: '/dashboard/chats' },
  { name: 'Meetings', icon: Calendar, href: '/dashboard/meetings' },
  { name: 'Media', icon: Image, href: '/dashboard/media' },
  { name: 'Personal Notes', icon: FileText, href: '/dashboard/notes' },
  { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <TooltipProvider>
      <div className={cn(
        "relative flex flex-col h-[calc(100vh-4rem)] border-r bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <div className="flex-1 py-4 overflow-y-auto">
          <nav className="flex flex-col space-y-2 px-2">
            {sidebarItems.map((item) => (
              <Tooltip key={item.name} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start",
                        pathname === item.href && "bg-muted",
                        isCollapsed && "justify-center px-2"
                      )}
                    >
                      <item.icon className={cn("h-5 w-5", !isCollapsed && "mr-2")} />
                      {!isCollapsed && <span>{item.name}</span>}
                    </Button>
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    {item.name}
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </nav>
        </div>
        <Button
          variant="ghost"
          className="absolute -right-4 top-4 h-8 w-8 rounded-full bg-slate-200 "
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
          <span className="sr-only">
            {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          </span>
        </Button>
      </div>
    </TooltipProvider>
  )
}

