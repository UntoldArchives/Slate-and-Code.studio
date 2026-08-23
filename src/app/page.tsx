import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import WorkMarquee from "@/components/WorkMarquee";
import ContactCTA from "@/components/ContactCTA";
import Process from "@/components/Process";
import About from "@/components/About";
import Footer from "@/components/Footer";
import Invert from "@/components/Invert";

export default function Home() {
  return (
    <main>
      {/* flips the whole page from ink to paper as #about takes the viewport */}
      <Invert targetId="about" />
      <Navbar />
      <Hero />
      <Manifesto />
      <WorkMarquee />
      <ContactCTA />
      <Process />
      <About />
      <Footer />
    </main>
  );
}
