import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ServicesHero from "@/components/ServicesHero";
import Packages from "@/components/Packages";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Invert from "@/components/Invert";

export const metadata: Metadata = {
  title: "Services · Slate & Code Studio",
  description:
    "Websites, business tools, and the systems behind them. Designed, built, and shipped by one studio.",
};

export default function Services() {
  return (
    <main>
      {/* the page turns over at the questions, so it ends on paper like home */}
      <Invert targetId="faq" />
      <Navbar />
      <ServicesHero />
      <Packages />
      <Faq />
      <Footer />
    </main>
  );
}
