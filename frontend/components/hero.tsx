import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <div className="bg-gradient-to-b from-white via-purple-100 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl md:text-6xl">
            Collaborate  same way with your team like never before
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-muted-foreground">
            Streamline your workflow, boost productivity, and achieve more together with our powerful team collaboration platform.
          </p>
          <div className="mt-10 flex justify-center space-x-4">
            <Button size="lg">Get Started</Button>
            <Button size="lg" variant="outline">Learn More</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

