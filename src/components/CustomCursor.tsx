"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/* Selector groups for the delegated hover states. */
const INTERACTIVE = 'a, button, [role="button"], label, summary, [data-cursor]';
const FIELDS = "input, textarea, select";

/**
 * Desktop-only blueprint cursor: a gold crosshair pinned to the pointer
 * with an ivory ring trailing on a spring, extending the CornerTick motif.
 * Coarse pointers and reduced motion render nothing, so the native cursor
 * is never hidden where this cannot replace it.
 */
export default function CustomCursor() {
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [overField, setOverField] = useState(false);
  const [label, setLabel] = useState("");

  // Crosshair tracks 1:1; the ring trails on a spring so motion reads
  // like a drafting instrument catching up to the hand.
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 400, damping: 35, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 400, damping: 35, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!fine || reduced) return;

    setActive(true);
    document.documentElement.classList.add("has-custom-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const over = (e: PointerEvent) => {
      if (!(e.target instanceof Element)) return;
      setOverField(e.target.closest(FIELDS) !== null);
      setHovering(e.target.closest(INTERACTIVE) !== null);
      const tagged = e.target.closest<HTMLElement>("[data-cursor-label]");
      setLabel(tagged?.dataset.cursorLabel ?? "");
    };
    const out = (e: PointerEvent) => {
      // A null relatedTarget means the pointer left the document entirely.
      if (e.relatedTarget === null) setVisible(false);
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const hide = () => setVisible(false);

    document.addEventListener("pointermove", move);
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerout", out);
    document.addEventListener("pointerdown", down);
    document.addEventListener("pointerup", up);
    document.documentElement.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);

    return () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [x, y]);

  if (!active) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[120]"
      initial={false}
      animate={{ opacity: visible && !overField ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Center crosshair, the CornerTick "+" riding the pointer */}
      <motion.span className="absolute left-0 top-0" style={{ x, y }}>
        <span className="relative block h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2">
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gold" />
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-gold" />
        </span>
      </motion.span>

      {/* Trailing ring + optional label from [data-cursor-label] */}
      <motion.span
        className="absolute left-0 top-0"
        style={{ x: ringX, y: ringY }}
      >
        <motion.span
          className="block h-[30px] w-[30px] rounded-full border"
          initial={false}
          style={{ x: "-50%", y: "-50%" }}
          animate={{
            scale: pressed ? 0.85 : hovering ? 1.5 : 1,
            borderColor: hovering
              ? "rgba(214, 168, 90, 0.6)"
              : "rgba(244, 241, 234, 0.25)",
          }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        />
        {label ? (
          <span className="micro absolute left-7 top-0 -translate-y-1/2 whitespace-nowrap text-gold">
            {label}
          </span>
        ) : null}
      </motion.span>
    </motion.div>
  );
}
