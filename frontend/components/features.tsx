import { CheckCircle, MessageSquare, Calendar, Bell } from 'lucide-react'

const features = [
  {
    name: 'Task Management',
    description: 'Organize and track your team\'s tasks with ease.',
    icon: CheckCircle,
  },
  {
    name: 'Real-time Chat',
    description: 'Communicate instantly with your team members.',
    icon: MessageSquare,
  },
  {
    name: 'Meeting Scheduler',
    description: 'Plan and schedule meetings effortlessly.',
    icon: Calendar,
  },
  {
    name: 'Smart Notifications',
    description: 'Stay updated with intelligent, timely alerts.',
    icon: Bell,
  },
]

export function Features() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Powerful Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to manage your team
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Our platform provides all the tools you need to keep your team organized, communicative, and productive.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col items-start">
                <div className="rounded-md bg-primary/10 p-2 ring-1 ring-primary/20">
                  <feature.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <dt className="mt-4 font-semibold">{feature.name}</dt>
                <dd className="mt-2 leading-7 text-muted-foreground">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

