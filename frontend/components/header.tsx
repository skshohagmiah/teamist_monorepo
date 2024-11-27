import Link from 'next/link'
import { AuthModals } from "@/components/auth-modals"

export function Header() {
  return (
    <header className="border-b sticky shadow bg-white top-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="sr-only">TeamCollab</span>
              <div className="h-8 w-8 bg-primary rounded-full" />
            </Link>
            <nav className="hidden md:ml-6 md:flex md:space-x-4">
              <Link href="/features" className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Features
              </Link>
              <Link href="/pricing" className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Pricing
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                About
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <AuthModals />
          </div>
        </div>
      </div>
    </header>
  )
}

