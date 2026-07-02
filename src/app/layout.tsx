import type { Metadata } from "next";
import { Inter, Space_Grotesk, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import ConsoleSignature from "@/components/ConsoleSignature";
import { SITE } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const DESCRIPTION =
  "A digital studio creating premium websites, business tools, and short-form content for brands that care about how their work looks, feels, and performs.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Slate & Code Studio | Design, Develop & Direct",
    template: "%s | Slate & Code Studio",
  },
  description: DESCRIPTION,
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: "Slate & Code Studio | Design, Develop & Direct",
    description: DESCRIPTION,
    url: SITE.url,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Slate & Code Studio | Design, Develop & Direct",
    description: DESCRIPTION,
  },
};

/** Organization schema. Organization (not LocalBusiness) keeps the no-location rule. */
const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  description: DESCRIPTION,
  logo: `${SITE.url}/icon.svg`,
  sameAs: [SITE.instagramUrl],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${grotesk.variable} ${instrument.variable}`}
    >
      <body className="bg-ink font-sans text-ivory">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
        />
        <SmoothScroll />
        <Nav />
        <main>{children}</main>
        <Footer />
        <div aria-hidden className="intro-fade" />
        <CustomCursor />
        <ConsoleSignature />
      </body>
    </html>
  );
}
