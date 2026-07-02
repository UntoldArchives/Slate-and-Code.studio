"use client";

import { useRef, type CSSProperties } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

// Sized in vw so the single line always spans the viewport the same way.
const wordmarkType =
  "whitespace-nowrap text-center font-display text-[10.5vw] font-semibold leading-[0.9] tracking-[-0.02em]";

// Quieter strokes than .text-outline, whose 0.9 alpha reads like a headline.
// Down here the wordmark is a closing texture, not competing display type.
const strokeIvory: CSSProperties = {
  WebkitTextStroke: "1.5px rgba(244, 241, 234, 0.28)",
  color: "transparent",
};
const strokeGold: CSSProperties = {
  WebkitTextStroke: "1.5px rgba(214, 168, 90, 0.55)",
  color: "transparent",
};

export default function FooterWordmark() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Fill sweep completes exactly as the wordmark's bottom edge meets the
  // viewport bottom, i.e. when the user has scrolled the page out entirely.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const fill = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.4,
  });
  // Clamp before mapping: the spring can overshoot past 1 at the page end.
  const clipPath = useTransform(fill, (v) => {
    const p = Math.min(1, Math.max(0, v));
    return `inset(0 ${(1 - p) * 100}% 0 0)`;
  });

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none relative w-full select-none overflow-hidden"
    >
      <div className={wordmarkType}>
        <span style={strokeIvory}>SLATE</span>{" "}
        <span style={strokeGold}>&</span>{" "}
        <span style={strokeIvory}>CODE</span>
      </div>

      {/* Gradient duplicate revealed left-to-right by the scroll-bound clip */}
      {!reduce && (
        <motion.div
          aria-hidden
          style={{
            clipPath,
            backgroundImage:
              "linear-gradient(90deg, var(--color-gold), var(--color-ivory))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
          className={`absolute inset-0 ${wordmarkType}`}
        >
          SLATE & CODE
        </motion.div>
      )}
    </div>
  );
}
