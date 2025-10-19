import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks  from "@/components/How-It-Works";
import Testimonials from "@/components/Testimonals";
import FAQ from "@/components/FAQ";
export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      
      <Hero/>
      <Features/>
      <HowItWorks/>
      <Testimonials/>
      <FAQ/>
    </main>
  );
}
