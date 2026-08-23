"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { EASE_HOUSE } from "@/lib/anim";
import { openContact } from "@/lib/contact";
import { scrollToTarget } from "@/lib/lenis";
import { TEXT_LINK as ITEM, TEXT_LINK_RULE as RULE } from "@/lib/ui";

export default function Navbar() {
  const [stuck, setStuck] = useState(false);
  const pathname = usePathname();
  const onHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className="rm-pin fixed inset-x-0 top-0 z-50"
      initial={{ y: "-110%" }}
      animate={{ y: "0%" }}
      transition={{ duration: 0.9, delay: 0.15, ease: [...EASE_HOUSE] }}
    >
      {/* the bar only grows a background once you leave the top */}
      <div
        className={`absolute inset-0 border-b transition-[opacity,backdrop-filter] duration-500 ${
          stuck
            ? "border-[var(--rule)] bg-[color-mix(in_oklab,var(--bg)_72%,transparent)] opacity-100 backdrop-blur-xl"
            : "border-transparent opacity-0"
        }`}
        aria-hidden
      />

      <div className="gut relative flex h-[clamp(52px,4.1vw,74px)] items-center">
        {/* left — mark + availability */}
        <div className="flex items-center gap-[clamp(12px,1.3vw,26px)]">
          {onHome ? (
            <button
              onClick={() => scrollToTarget(0)}
              className="font-thunder text-[clamp(19px,1.42vw,29px)] font-medium leading-none tracking-[0.01em] text-[var(--fg)]"
              aria-label="Slate and Code, back to top"
            >
              S&amp;C
            </button>
          ) : (
            <Link
              href="/"
              className="font-thunder text-[clamp(19px,1.42vw,29px)] font-medium leading-none tracking-[0.01em] text-[var(--fg)]"
              aria-label="Slate and Code, home"
            >
              S&amp;C
            </Link>
          )}
          <span className="hidden items-center gap-[0.7em] text-[length:var(--fs-micro)] sm:flex">
            <span className="animate-blink block size-[0.42em] rounded-full bg-accent" />
            <span className="micro text-accent">Available</span>
          </span>
        </div>

        {/*
          Contact sits on the exact centre line of the page: it is the only
          in-flow child of this wrapper, so the -translate-x-1/2 centres the
          pill itself rather than the pill plus the links. Work and Services
          then hang off its right edge with `left-full`, which keeps them
          close to it instead of pushed out to the page margin.
        */}
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center">
          <button
            type="button"
            onClick={openContact}
            className="micro group relative overflow-hidden rounded-full border border-[var(--rule)] px-[1.5em] py-[0.85em] text-[var(--fg)] transition-colors duration-[450ms] hover:border-accent hover:text-white"
          >
            <span className="relative z-10">Contact</span>
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100" />
          </button>

          <nav className="absolute left-full ml-[clamp(18px,2.2vw,46px)] hidden items-center gap-[clamp(16px,1.9vw,38px)] sm:flex">
            {onHome ? (
              <button onClick={() => scrollToTarget("#work")} className={ITEM}>
                Work
                <span className={RULE} />
              </button>
            ) : (
              <Link href="/#work" className={ITEM}>
                Work
                <span className={RULE} />
              </Link>
            )}
            <Link href="/services" className={ITEM}>
              Services
              <span className={RULE} />
            </Link>
          </nav>
        </div>

        {/* phones: no room to hang off the pill, so the same two links sit
            on the right edge of the bar instead */}
        <nav className="ml-auto flex items-center gap-[1.2em] sm:hidden">
          {onHome ? (
            <button onClick={() => scrollToTarget("#work")} className={ITEM}>
              Work
              <span className={RULE} />
            </button>
          ) : (
            <Link href="/#work" className={ITEM}>
              Work
              <span className={RULE} />
            </Link>
          )}
          <Link href="/services" className={ITEM}>
            Services
            <span className={RULE} />
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}
