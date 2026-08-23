import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ContactModal from "@/components/ContactModal";

export const metadata: Metadata = {
  title: "Slate & Code Studio",
  description:
    "A studio of one, by design. The same person who designs the screen writes the code behind it and directs the content that fills it.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* The two faces that carry the whole page — fetched before paint. */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/fonts/Thunder-Bold.woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/fonts/NeueMontreal-Medium.woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
        <ContactModal />
      </body>
    </html>
  );
}
