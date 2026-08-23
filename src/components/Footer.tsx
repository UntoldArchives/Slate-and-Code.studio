"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { PiInstagramLogo, PiEnvelopeSimple } from "react-icons/pi";
import { LINKS, MAILTO } from "@/lib/links";
import { scrollToTarget } from "@/lib/lenis";
import { SET_WIDTH } from "@/lib/type";

/* The wordmark is cut into this many horizontal bands. Each band slides its
   own copy of the word by a different distance, so at the start of the scroll
   the mark reads as offset slices and only resolves once you reach the end of
   the page. Travel is in vw so it scales with the mark itself. */
const BAND_TRAVEL = [17, -11, 21, -8, 13];
const BANDS = BAND_TRAVEL.length;

/* matches the hero mark exactly: same string, same near-bleed inset */
const FS = `calc((100vw - var(--edge) * 2) / ${SET_WIDTH.wordmark})`;
const MARK_H = `calc(${FS} * 0.9)`;
const BAND_H = `calc(${MARK_H} / ${BANDS})`;

/* mirrors the navbar: Work is an anchor on the home page, Services is a route */
const NAV = [
  { label: "Work", href: "/#work", target: "#work" },
  { label: "Studio", href: "/#about", target: "#about" },
  { label: "Services", href: "/services", target: null },
];

/* only the channels that exist: a glyph with nowhere to go is noise */
const SOCIALS = [
  { href: LINKS.instagram, label: "Instagram", Icon: PiInstagramLogo },
  { href: MAILTO, label: "Email", Icon: PiEnvelopeSimple },
];

function Band({
  index,
  progress,
}: {
  index: number;
  progress: ReturnType<typeof useSpring>;
}) {
  const y = useTransform(
    progress,
    [0, 1],
    [`${BAND_TRAVEL[index]}vw`, "0vw"]
  );

  return (
    <div
      className="absolute inset-x-[var(--edge)] overflow-hidden"
      style={{ top: `calc(${BAND_H} * ${index})`, height: BAND_H }}
    >
      <motion.p
        className="display absolute left-0 whitespace-nowrap text-[var(--fg)] will-change-transform"
        style={{ top: `calc(${BAND_H} * ${-index})`, fontSize: FS, y }}
      >
        Slate &amp; Code
        <span className="text-accent">&rsquo;</span>
      </motion.p>
    </div>
  );
}

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const onHome = usePathname() === "/";

  /* 0 as the footer enters the viewport, 1 once it is fully on screen.
     Scroll-linked, so it runs in reverse the moment you scroll back up. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.0005,
  });

  return (
    <footer
      ref={ref}
      className="relative flex flex-col justify-end overflow-hidden pb-0 pt-[clamp(40px,6vw,130px)] lg:min-h-svh"
    >
      {/* on a phone or tablet the two blocks stack at the bottom; on desktop
          they take the full height and push apart. A portrait tablet is tall
          and its mark is small, so the desktop treatment leaves a void. */}
      <div className="flex flex-1 flex-col justify-end gap-[clamp(50px,7vw,140px)] lg:justify-between">
        {/* the actual ask, before the mark */}
        <div className="gut flex flex-wrap items-start justify-between gap-[clamp(28px,4vw,80px)]">
          <div>
            <span className="micro block text-[var(--fg-70)]">
              Have something in mind
            </span>
            <a
              href={MAILTO}
              className="group mt-[0.6em] inline-block text-[length:clamp(20px,2.6vw,54px)] font-medium leading-[1.05] tracking-[-0.03em] text-[var(--fg)]"
            >
              {LINKS.email}
              <span className="block h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
            </a>
          </div>

          <nav className="micro flex flex-col items-start gap-[0.9em] text-[var(--fg-70)] sm:items-end">
            {NAV.map((n) =>
              onHome && n.target ? (
                <button
                  key={n.label}
                  onClick={() => scrollToTarget(n.target as string)}
                  className="transition-colors duration-300 hover:text-accent"
                >
                  {n.label}
                </button>
              ) : (
                <Link
                  key={n.label}
                  href={n.href}
                  className="transition-colors duration-300 hover:text-accent"
                >
                  {n.label}
                </Link>
              )
            )}
          </nav>
        </div>

        {/* the mark, assembling as you reach the end of the page. Sits on the
            near-bleed inset rather than the page gutter, so it lands at exactly
            the size the hero mark does. */}
        <div
          className="relative w-full px-[var(--edge)]"
          style={{ height: MARK_H }}
          role="img"
          aria-label="Slate & Code"
        >
          {/* five copies of the word, one per band: read once via the label */}
          <div aria-hidden className="contents">
            {BAND_TRAVEL.map((_, i) => (
              <Band key={i} index={i} progress={progress} />
            ))}
          </div>
        </div>
      </div>

      {/* socials */}
      <div className="gut mt-[clamp(28px,3.4vw,72px)] flex items-center justify-between">
        <span className="micro hidden text-[var(--fg-70)] sm:block">
          Available for new work
        </span>
        <div className="flex items-center gap-[clamp(16px,1.6vw,34px)]">
          {SOCIALS.map(({ href, label, Icon }) => {
            const external = !href.startsWith("mailto:");
            return (
              <a
                key={label}
                href={href}
                aria-label={label}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="text-[var(--fg-70)] transition-colors duration-300 hover:text-accent"
              >
                <Icon aria-hidden className="size-[clamp(19px,1.35vw,28px)]" />
              </a>
            );
          })}
        </div>
      </div>

      {/* bottom bar */}
      <div className="gut micro mt-[clamp(20px,2.2vw,44px)] flex items-center justify-between border-t border-[var(--rule)] py-[clamp(14px,1.1vw,24px)] text-[var(--fg-70)]">
        <span>&copy; 2026 Slate &amp; Code Studio</span>
        <span className="hidden md:block">slateandcode.studio</span>
        <button
          onClick={() => scrollToTarget(0)}
          className="transition-colors duration-300 hover:text-accent"
        >
          Back to top &#8593;
        </button>
      </div>
    </footer>
  );
}
