"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/* Stagger order: top-left, top-right, bottom-left, bottom-right */
const CORNERS = ["left-3 top-3", "right-3 top-3", "bottom-3 left-3", "bottom-3 right-3"];

/** Blueprint crosshair ticks on the CTA card corners, hairlines draw in on scroll */
export default function CornerTicks() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <>
        {CORNERS.map((pos) => (
          <span key={pos} aria-hidden className={`pointer-events-none absolute h-3.5 w-3.5 ${pos}`}>
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gold/40" />
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-gold/40" />
          </span>
        ))}
      </>
    );
  }

  return (
    <>
      {CORNERS.map((pos, i) => {
        const transition = { duration: 0.5, ease: EASE, delay: 0.15 + i * 0.09 };
        return (
          <span key={pos} aria-hidden className={`pointer-events-none absolute h-3.5 w-3.5 ${pos}`}>
            <motion.span
              className="absolute left-1/2 top-0 h-full w-px origin-center -translate-x-1/2 bg-gold/40"
              initial={{ scaleY: 0, opacity: 0 }}
              whileInView={{ scaleY: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={transition}
            />
            <motion.span
              className="absolute left-0 top-1/2 h-px w-full origin-center -translate-y-1/2 bg-gold/40"
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={transition}
            />
          </span>
        );
      })}
    </>
  );
}
