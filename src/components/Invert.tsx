"use client";

import { useEffect } from "react";
import { clamp01 } from "@/lib/anim";

/*
  Drives the page flip from ink (paper text) to paper (ink text) as the given
  section climbs the viewport. Every colour on the site is a color-mix() off
  these two numbers, so the whole page turns over together instead of the
  About block going white against a black tail above it.

  Two numbers, not one: --p-invert moves the background across the full
  window, while --p-fg holds the text on its old colour and flips it late,
  inside a narrow band near the end. Run on a single value and the page spends
  a long beat on mid grey with mid grey text on it, which is unreadable. Run
  --p-fg early and headings and icons go black while the page behind them is
  still dark, which reads as them changing ahead of everything else. Late is
  the one that looks right: nothing turns dark until the page under it is
  already light enough to carry it.

  Scroll-linked rather than triggered, so it runs backwards on the way up.
*/
export default function Invert({ targetId }: { targetId: string }) {
  useEffect(() => {
    const root = document.documentElement;
    let raf = 0;
    let last = -1;

    /* Smootherstep. A linear cross-fade parks the page on mid grey for a
       long moment, where neither the old nor the new text colour has any
       contrast. This spends its time at the two ends and crosses the middle
       nearly twice as fast. */
    const ease = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

    const tick = () => {
      const el = document.getElementById(targetId);
      if (el) {
        const vh = window.innerHeight;
        const { top } = el.getBoundingClientRect();
        /* Runs from just before the section appears to just after it has
           taken the lower half of the screen, so the grey moment lands in
           the gap between two sections rather than under a headline. */
        const raw = clamp01((vh * 1.05 - top) / (vh * 0.5));
        const p = ease(raw);
        /* only touch the DOM when the value actually moves */
        if (Math.abs(p - last) > 0.001) {
          root.style.setProperty("--p-invert", p.toFixed(4));
          root.style.setProperty(
            "--p-fg",
            ease(clamp01((p - 0.58) / 0.3)).toFixed(4)
          );
          last = p;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      root.style.removeProperty("--p-invert");
      root.style.removeProperty("--p-fg");
    };
  }, [targetId]);

  return null;
}
