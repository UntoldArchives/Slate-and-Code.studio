import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ServicesHero from "@/components/ServicesHero";
import Packages from "@/components/Packages";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Invert from "@/components/Invert";
import { OG_IMAGE } from "@/lib/site";

const TITLE = "Services and Pricing";
const DESCRIPTION =
  "Websites from $1,000, business websites from $2,500, custom business tools from $3,000. Designed, built, and shipped by one studio.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/services" },
  openGraph: {
    type: "website",
    url: "/services",
    title: `${TITLE} · Slate & Code Studio`,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} · Slate & Code Studio`,
    description: DESCRIPTION,
    images: [OG_IMAGE.url],
  },
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
