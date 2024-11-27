import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Project Manager',
    image: '/placeholder-avatar-1.jpg',
    quote: 'TeamCollab has revolutionized how we manage projects. It\'s intuitive, powerful, and has greatly improved our team\'s productivity.',
  },
  {
    name: 'Michael Chen',
    role: 'Software Developer',
    image: '/placeholder-avatar-2.jpg',
    quote: 'The real-time collaboration features are game-changing. It\'s like having my team right next to me, even when we\'re working remotely.',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Marketing Director',
    image: '/placeholder-avatar-3.jpg',
    quote: 'I love how TeamCollab integrates all our tools in one place. It\'s saved us countless hours and streamlined our entire workflow.',
  },
]

export function Testimonials() {
  return (
    <div className="bg-muted py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-primary">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by teams everywhere
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="bg-background pt-8 pb-16 px-6 rounded-2xl shadow-sm ring-1 ring-muted">
                <figure className="mt-6">
                  <blockquote className="text-lg leading-8 text-foreground">
                    <p>&quot;{testimonial.quote}&quot;</p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-x-4">
                    <Avatar>
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

