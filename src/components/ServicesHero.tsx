"use client";

import { motion, type Variants } from "motion/react";
import { EASE_HOUSE } from "@/lib/anim";
import { WordsReveal } from "./reveal";

/* Same construction as the home hero: the word is set to span the page on the
   near-bleed inset, and the vertical rhythm is carried by flex-grow ratios
   rather than fixed offsets. "SERVICES" measures 2.699em in Thunder Bold. */
const TITLE_SIZE = "calc((100vw - var(--edge) * 2) / 2.699)";

const LETTERS = "SERVICES".split("");
/* scattered arrival, matching the home mark's behaviour */
const ARRIVAL = [3, 0, 6, 1, 7, 4, 2, 5];
const SLOT = new Map(ARRIVAL.map((i, slot) => [i, slot]));

const glyph: Variants = {
  hidden: { y: "115%" },
  visible: (slot: number) => ({
    y: "0%",
    transition: { duration: 1.25, delay: 0.3 + slot * 0.072, ease: [...EASE_HOUSE] },
  }),
};

export default function ServicesHero() {
  return (
    <section className="relative flex min-h-[76svh] flex-col lg:min-h-svh">
      {/* same collapse as the home hero: the frame's ratios assume a mark a
          third of the height, so on a phone or tablet the voids shrink */}
      <div className="min-h-[clamp(64px,8vh,120px)] flex-[1.6] lg:flex-[4.07]" />

      <div className="shrink-0">
        <h1
          className="display -mb-[0.143em] block whitespace-nowrap px-[var(--edge)] text-[var(--fg)]"
          style={{ fontSize: TITLE_SIZE }}
          aria-label="Services"
        >
          {LETTERS.map((ch, i) => (
            <span
              key={i}
              className="inline-block overflow-hidden whitespace-pre align-bottom"
              aria-hidden
            >
              <motion.span
                className="inline-block will-change-transform"
                variants={glyph}
                custom={SLOT.get(i) ?? 0}
                initial="hidden"
                animate="visible"
              >
                {ch}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* ghost line: texture at 19%, so it is read once in plain text instead */}
        <p className="sr-only">Websites, business tools, systems.</p>
        <motion.p
          aria-hidden
          className="gut display whitespace-nowrap text-[var(--fg)] opacity-[0.19]"
          style={{ fontSize: `calc(${TITLE_SIZE} * 0.1779)` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.19 }}
          transition={{ duration: 1.1, delay: 1.3, ease: [...EASE_HOUSE] }}
        >
          Websites Business Tools Systems
        </motion.p>
      </div>

      <div className="flex-[1] lg:flex-[1.86]" />

      <div className="gut shrink-0">
        <WordsReveal
          text="Services built to upgrade and launch businesses."
          className="w-[min(48.44vw,100%)] text-[length:clamp(15px,1.872vw,40px)] font-bold leading-[1.2] text-[var(--fg)] max-lg:w-[min(72vw,100%)]"
          delay={1.4}
          stagger={0.026}
        />
        <motion.p
          className="mt-[0.9em] w-[min(44vw,100%)] text-[length:var(--fs-body)] leading-[1.45] text-[var(--fg-70)] max-lg:w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2, ease: [...EASE_HOUSE] }}
        >
          Websites, business tools, and the systems behind them. Designed,
          built, and shipped by one studio.
        </motion.p>
      </div>

      <div className="min-h-[clamp(24px,4vh,70px)] flex-[0.9] lg:flex-[1]" />
    </section>
  );
}
