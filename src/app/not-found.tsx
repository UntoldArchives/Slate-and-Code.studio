import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TEXT_LINK, TEXT_LINK_RULE } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

/* Built from the hero's parts: a micro label, a Thunder verdict with the
   accent full stop the contact panel uses, a lead line and the two text
   links. No invert on this page, so it stays on ink. */
export default function NotFound() {
  return (
    <main>
      <Navbar />
      <section className="gut flex min-h-[76svh] flex-col justify-end pt-[clamp(100px,14vh,200px)] pb-[clamp(48px,7vw,130px)] lg:min-h-svh">
        <p className="micro text-[var(--fg-70)]">Error 404</p>
        <h1
          className="display mt-[0.25em] text-[var(--fg)]"
          style={{ fontSize: "clamp(64px, 18vw, 360px)" }}
        >
          Not found<span className="text-accent">.</span>
        </h1>
        <p className="mt-[1em] max-w-[38ch] text-[length:var(--fs-lead)] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--fg)]">
          There is nothing at this address. The work and the services are
          both one link away.
        </p>
        <nav
          aria-label="Where to go instead"
          className="mt-[2.2em] flex flex-wrap gap-[clamp(20px,2.4vw,48px)]"
        >
          <Link href="/" className={`${TEXT_LINK} inline-flex min-h-[24px] items-center`}>
            Back to the studio
            <span className={TEXT_LINK_RULE} />
          </Link>
          <Link href="/services" className={`${TEXT_LINK} inline-flex min-h-[24px] items-center`}>
            Services
            <span className={TEXT_LINK_RULE} />
          </Link>
        </nav>
      </section>
      <Footer />
    </main>
  );
}
