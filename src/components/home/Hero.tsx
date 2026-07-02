"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ButtonLight, ArrowIcon } from "@/components/Buttons";
import Magnetic from "@/components/Magnetic";
import WaveBackground from "@/components/home/WaveBackground";

// Centered staircase headline, one line solid, one outlined, one gold.
// fill flags the outlined line for the hover ink-fill sweep.
const LINES: { text: string; className: string; fill?: boolean }[] = [
  { text: "Designer", className: "text-ivory" },
  { text: "Developer", className: "text-outline", fill: true },
  { text: "Director", className: "text-pit" },
];

export default function Hero() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  // Light fade-to-black as the hero scrolls away: content fades out over the
  // first half, a black layer rises over the back half, handing off to the
  // (already bg-pit) work section. No pinning — plain scroll-linked transforms.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.55], [0, -40]);
  const overlayOpacity = useTransform(scrollYProgress, [0.45, 1], [0, 1]);
  const contentStyle = reduce ? undefined : { opacity: contentOpacity, y: contentY };
  const overlayStyle = reduce ? undefined : { opacity: overlayOpacity };

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section
      ref={heroRef}
      className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 text-center sm:px-8"
    >
      {/* Animated gold fog */}
      <WaveBackground className="absolute inset-0 -z-10 h-full w-full" />

      {/* Legibility: soft dark seat behind the title + top scrim under the Nav.
          The shader's mountain silhouette already blacks out the lower edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_58%_28%_at_50%_41%,rgba(9,9,9,0.6),rgba(9,9,9,0.15)_55%,transparent_80%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-pit/70 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[16vh] bg-gradient-to-t from-pit to-transparent"
      />

      {/* Content */}
      <motion.div
        style={contentStyle}
        className="relative z-10 flex w-full max-w-3xl flex-col items-center"
      >
        <h1 className="font-display text-[3.1rem] font-semibold leading-[1.04] tracking-[-0.01em] sm:text-[4.2rem] lg:text-[4.6rem]">
          {LINES.map((l, i) => (
            <span key={l.text} className="block overflow-hidden pb-[0.07em]">
              <motion.span
                initial={reduce ? false : { y: "115%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.15 + i * 0.14,
                  ease: [0.22, 1, 0.36, 1],
                  opacity: { duration: 0.6, delay: 0.15 + i * 0.14, ease: "easeOut" },
                }}
                className={`block ${l.className}`}
              >
                {l.fill && !reduce ? (
                  <span className="group relative inline-block">
                    {l.text}
                    {/* Ink fill: gradient twin clipped to zero width, swept open on hover.
                        Stroke is inherited from text-outline, so zero it here. */}
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-r from-gold to-ivory bg-clip-text text-transparent [-webkit-text-stroke:0] [clip-path:inset(0_100%_0_0)] transition-[clip-path] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[clip-path:inset(0_0_0_0)] group-hover:duration-[650ms]"
                    >
                      {l.text}
                    </span>
                  </span>
                ) : (
                  l.text
                )}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p {...rise(0.62)} className="micro mt-6 text-fog">
          Websites · Tools · Reels
        </motion.p>

        <motion.div {...rise(0.74)} className="mt-9">
          <Magnetic>
            <ButtonLight href="/contact">
              Start a Project <ArrowIcon />
            </ButtonLight>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden
        style={contentStyle}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
      >
        <span className="flex h-10 w-7 items-center justify-center rounded-full border border-ivory/25">
          <motion.svg
            viewBox="0 0 16 16"
            fill="none"
            className="h-3.5 w-3.5 text-gold"
            animate={reduce ? undefined : { y: [0, 4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <path
              d="M8 3v9M4.5 8.5 8 12l3.5-3.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </span>
      </motion.div>

      {/* Fade-to-black overlay (rises over the back half of the scroll-out) */}
      <motion.div
        aria-hidden
        style={overlayStyle}
        className="pointer-events-none absolute inset-0 z-20 bg-pit opacity-0"
      />
    </section>
  );
}
