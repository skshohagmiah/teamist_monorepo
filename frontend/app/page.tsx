import { CTA } from "@/components/cta";
import { Features } from "@/components/features";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import Hero from "@/components/hero";
import { Testimonials } from "@/components/testimonials";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <Separator />
      <Features />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  )
}

