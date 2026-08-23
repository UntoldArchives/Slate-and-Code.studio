"use client";

import { motion, type Variants } from "motion/react";
import { EASE_HOUSE } from "@/lib/anim";
import { SET_WIDTH } from "@/lib/type";
import { WordsReveal } from "./reveal";

const GLYPHS = ["S", "L", "A", "T", "E", " ", "&", " ", "C", "O", "D", "E", "\u2019"];

/*
  Order the glyphs arrive in. Scattered on purpose, so the wordmark assembles
  itself instead of typing out left to right. Hard-coded rather than shuffled
  at runtime: a random order would differ between the server and client render
  and blow up hydration, and it would land differently on every reload.
*/
const ARRIVAL = [6, 0, 9, 3, 11, 1, 8, 4, 12, 2, 10];

const STAGGER = 0.072;

/* index in the string -> its slot in the arrival order */
const SLOT = new Map(ARRIVAL.map((glyphIndex, slot) => [glyphIndex, slot]));

const glyph: Variants = {
  hidden: { y: "115%" },
  visible: (slot: number) => ({
    y: "0%",
    transition: {
      duration: 1.25,
      delay: 0.35 + slot * STAGGER,
      ease: [...EASE_HOUSE],
    },
  }),
};

/* ---------------------------------------------------------------------------
   Measurements below come straight off the Figma frame (2564 x 1683), turned
   into viewport units so the composition holds its proportions at any width.

     wordmark   616.818px, inset 26px      -> 24.06vw, 1.01vw
     sub-line   109.758px at 19% opacity   -> 0.1779x the wordmark
     paragraph  48px Bold, 1242px measure  -> 1.872vw, 48.44vw

   The vertical rhythm is reproduced with flex-grow ratios rather than fixed
   offsets, taken from the gaps in the frame (33.9 : 15.5 : 8.3). That keeps
   the Figma spacing on a 1683-tall frame and still fits a short, wide desktop.
--------------------------------------------------------------------------- */

const WORDMARK_SIZE = `calc((100vw - var(--edge) * 2) / ${SET_WIDTH.wordmark})`;

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[76svh] flex-col lg:min-h-svh"
    >
      {/* space above the mark, holding the navbar clear. The frame's flex
          ratios assume the mark is a third of the height; on a phone it is a
          sliver, so the voids collapse to keep the composition tight. */}
      <div className="min-h-[clamp(64px,8vh,120px)] flex-[1.6] lg:flex-[4.07]" />

      <div className="shrink-0">
        <h1
          className="display -mb-[0.143em] block whitespace-nowrap px-[var(--edge)] text-[var(--fg)]"
          style={{ fontSize: WORDMARK_SIZE }}
          aria-label="Slate & Code"
        >
          {GLYPHS.map((ch, i) => (
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
                {i === 12 ? <span className="text-accent">{ch}</span> : ch}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* the ghost line tucked under the mark, as in the frame */}
        <motion.p
          className="gut display whitespace-nowrap text-[var(--fg)] opacity-[0.19]"
          style={{ fontSize: `calc(${WORDMARK_SIZE} * 0.1779)` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.19 }}
          transition={{ duration: 1.1, delay: 1.35, ease: [...EASE_HOUSE] }}
        >
          Websites Software Systems
        </motion.p>
      </div>

      <div className="flex-[1] lg:flex-[1.86]" />

      {/* the gutter lives on the wrapper, never on the same element as the
          measure: with border-box the padding would come straight out of the
          1242px the frame sets, and the copy would break a word early */}
      <div className="gut shrink-0">
        <WordsReveal
          text="Slate & Code Studio is a studio of design. The same person who designs the screen writes the code behind it and directs the content that fills it."
          className="w-[min(48.44vw,100%)] text-[length:clamp(15px,1.872vw,40px)] font-bold leading-[1.2] text-[var(--fg)] max-lg:w-[min(72vw,100%)]"
          delay={1.5}
          stagger={0.026}
        />
      </div>

      <div className="min-h-[clamp(24px,4vh,70px)] flex-[0.9] lg:flex-[1]" />
    </section>
  );
}
