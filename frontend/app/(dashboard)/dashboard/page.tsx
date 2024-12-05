'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CalendarIcon, MessageCircle, ImageIcon, Users, LogOut, Menu, PenTool, Bell } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usePathname, useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter();
  const pathname = usePathname()


  useEffect(() => {
    if (pathname?.includes('/dashboard')) {
      router.push('/dashboard/tasks')
    }
  }, [])


  return null;

  return (
    <div className="flex h-screen ">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">Total Tasks</CardTitle>
                <CalendarIcon className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">25</div>
                <p className="text-xs text-blue-600">5 due today</p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">Unread Messages</CardTitle>
                <MessageCircle className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">12</div>
                <p className="text-xs text-green-600">3 new since last login</p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-700">Recent Media</CardTitle>
                <ImageIcon className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">7</div>
                <p className="text-xs text-purple-600">Files uploaded this week</p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-pink-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-pink-700">Active Projects</CardTitle>
                <PenTool className="h-4 w-4 text-pink-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-pink-900">4</div>
                <p className="text-xs text-pink-600">2 whiteboards in progress</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4 ">
            <Card className="col-span-2 border border-purple-300 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className=" border-b border-indigo-100">
                <CardTitle className="text-indigo-800">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {[
                    { type: 'task', content: 'Sarah completed "Update client presentation"', time: '2 hours ago' },
                    { type: 'chat', content: 'New message in "Project X" chat', time: '3 hours ago' },
                    { type: 'media', content: 'John uploaded "Q4 Report.pdf"', time: '5 hours ago' },
                    { type: 'whiteboard', content: 'New whiteboard session started: "Brainstorming"', time: 'Yesterday' },
                    { type: 'task', content: 'Deadline reminder: "Submit proposal" due in 2 days', time: 'Yesterday' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start space-x-4 mb-4 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <Avatar className={`
                        ${item.type === 'task' ? 'bg-blue-100' :
                          item.type === 'chat' ? 'bg-green-100' :
                            item.type === 'media' ? 'bg-purple-100' :
                              item.type === 'whiteboard' ? 'bg-pink-100' : 'bg-gray-100'}
                      `}>
                        <AvatarFallback className={`
                          ${item.type === 'task' ? 'text-blue-600' :
                            item.type === 'chat' ? 'text-green-600' :
                              item.type === 'media' ? 'text-purple-600' :
                                item.type === 'whiteboard' ? 'text-pink-600' : 'text-gray-600'}
                        `}>{item.type[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{item.content}</p>
                        <p className="text-xs text-gray-500">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
            <Card className="border border-emerald-300 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="">
                <CardTitle className="text-emerald-800">Team Members</CardTitle>
                <CardDescription className="text-emerald-600">Recently active</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  {['Alice Johnson', 'Bob Smith', 'Carol Williams', 'David Brown'].map((name, i) => (
                    <div key={i} className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <Avatar className="bg-cyan-100">
                        <AvatarFallback className="text-cyan-700">{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{name}</p>
                        <p className="text-xs text-gray-500">Active {i * 5 + 5}m ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}