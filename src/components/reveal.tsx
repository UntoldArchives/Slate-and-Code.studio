"use client";

import { Fragment } from "react";
import { motion, type Variants } from "motion/react";
import { EASE_HOUSE } from "@/lib/anim";

/* ---------------------------------------------------------------------------
   WordsReveal — words rise and sharpen into place, one after another.

   No overflow clipping: the words drift up from a short distance while a
   blur burns off, which reads much softer than words snapping out from
   behind a hard mask edge.
--------------------------------------------------------------------------- */

type WordsRevealProps = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  /* run when scrolled into view instead of on mount */
  inView?: boolean;
  amount?: number;
};

const word: Variants = {
  hidden: { opacity: 0, y: "0.42em", filter: "blur(7px)" },
  visible: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { duration: 0.95, ease: [...EASE_HOUSE] },
  },
};

export function WordsReveal({
  text,
  className,
  delay = 0,
  stagger = 0.028,
  inView = false,
  amount = 0.4,
}: WordsRevealProps) {
  const words = text.split(" ");

  const container: Variants = {
    hidden: {},
    visible: { transition: { delayChildren: delay, staggerChildren: stagger } },
  };

  return (
    <motion.p
      className={className}
      variants={container}
      initial="hidden"
      {...(inView
        ? { whileInView: "visible", viewport: { once: true, amount } }
        : { animate: "visible" })}
    >
      {/* The space has to live BETWEEN the spans as its own text node, not
          inside them. Tucked inside it cannot collapse at the end of a wrapped
          line: centred text ends up pushed half a space off centre, and every
          line breaks a word early because the trailing space still has to
          fit. */}
      {words.map((w, i) => (
        <Fragment key={i}>
          <motion.span
            className="inline-block will-change-[transform,filter,opacity]"
            variants={word}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </motion.p>
  );
}

/* ---------------------------------------------------------------------------
   MaskReveal — one masked slide-up for a whole block (headings, single lines).
--------------------------------------------------------------------------- */

type MaskRevealProps = {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  delay?: number;
  duration?: number;
  inView?: boolean;
  amount?: number;
};

export function MaskReveal({
  children,
  className,
  innerClassName,
  delay = 0,
  duration = 1.1,
  inView = false,
  amount = 0.4,
}: MaskRevealProps) {
  /* The in-view observer must watch the (unclipped) wrapper — the masked
     child starts fully outside it, so observing the child never fires. */
  const inner: Variants = {
    hidden: { y: "110%" },
    visible: {
      y: "0%",
      transition: { duration, delay, ease: [...EASE_HOUSE] },
    },
  };

  return (
    <motion.div
      className={`overflow-hidden ${className ?? ""}`}
      initial="hidden"
      {...(inView
        ? { whileInView: "visible", viewport: { once: true, amount } }
        : { animate: "visible" })}
    >
      <motion.div className={innerClassName} variants={inner}>
        {children}
      </motion.div>
    </motion.div>
  );
}
