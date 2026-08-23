import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ContactModal from "@/components/ContactModal";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";

const DESCRIPTION =
  "A studio of one, by design. The same person who designs the screen writes the code behind it and directs the content that fills it.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} · Websites, Software, Systems`,
    template: `%s · ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: "/",
    title: `${SITE_NAME} · Websites, Software, Systems`,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} · Websites, Software, Systems`,
    description: DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  alternates: { canonical: "/" },
};

/* the faces on screen at first paint: the two hero marks, the nav labels and
   the hero paragraph. Regular is body copy further down and loads on demand. */
const PRELOAD = [
  "Thunder-Bold",
  "Thunder-Medium",
  "NeueMontreal-Medium",
  "NeueMontreal-Bold",
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {PRELOAD.map((f) => (
          <link
            key={f}
            rel="preload"
            as="font"
            type="font/woff2"
            href={`/fonts/${f}.woff2`}
            crossOrigin="anonymous"
          />
        ))}
      </head>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
        <ContactModal />
      </body>
    </html>
  );
}
