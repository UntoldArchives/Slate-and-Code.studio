import Link from "next/link";
import { SITE } from "@/lib/site";
import Year from "@/components/Year";
import FooterWordmark from "@/components/FooterWordmark";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-pit">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <span className="block h-2 w-2 rotate-45 bg-gold" />
              <span className="font-display text-sm font-semibold tracking-[0.18em] text-ivory">
                SLATE <span className="text-gold">&</span> CODE
                <span className="ml-2 text-[10px] font-medium tracking-[0.3em] text-fog">
                  STUDIO
                </span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-fog">
              A digital studio. Premium websites, business tools,
              and short-form content, built with taste.
            </p>
          </div>

          <div>
            <p className="micro text-fog">Navigate</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-fog transition-colors hover:text-ivory">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-fog transition-colors hover:text-ivory">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-fog transition-colors hover:text-ivory">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="micro text-fog">Reach out</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href={SITE.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold/90 transition-colors hover:text-gold"
                >
                  Instagram · {SITE.instagramHandle}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-fog transition-colors hover:text-ivory"
                >
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-fog">
            © <Year /> Slate & Code Studio. All rights reserved.
          </p>
          <p className="micro text-fog/70">Working with brands worldwide</p>
        </div>
      </div>

      {/* Full-bleed closing beat: giant outline wordmark anchored to the page end */}
      <div className="-mb-[1vw] mt-4">
        <FooterWordmark />
      </div>
    </footer>
  );
}
