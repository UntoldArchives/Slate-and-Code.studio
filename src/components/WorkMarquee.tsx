"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cubic, EASE_OUT } from "@/lib/anim";
import { MaskReveal } from "./reveal";

const WORKS = [
  { src: "/work/crescent-car-check.webp", alt: "Crescent Car Check" },
  { src: "/work/voidform.webp", alt: "Voidform" },
  { src: "/work/norhus-real-estate.webp", alt: "Norhus Real Estate" },
  { src: "/work/untold-archives.webp", alt: "Untold Archives" },
  { src: "/work/perch.webp", alt: "Perch" },
  { src: "/work/kairos-k01.webp", alt: "Kairos K-01" },
  { src: "/work/superior-ink.webp", alt: "Superior Ink" },
  { src: "/work/mubarak-auto.webp", alt: "Mubarak Auto" },
  { src: "/work/discontinued.webp", alt: "Discontinued" },
  { src: "/work/virdis-supplement.webp", alt: "Virdis Supplement" },
];

/* how much faster the track runs while the pointer is held down */
const SKIM_MULTIPLIER = 24;
/* horizontal blur, in px of standard deviation, at full skim speed. Enough
   to read as speed, not so much that the work stops being legible. */
const MAX_BLUR = 8;

export default function WorkMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement>(null);

  const pos = useRef(0);
  const speed = useRef(0);
  const holding = useRef(false);
  const blurOn = useRef(false);

  const [hovering, setHovering] = useState(false);
  const [held, setHeld] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 500, damping: 42 });
  const sy = useSpring(my, { stiffness: 500, damping: 42 });

  useEffect(() => {
    let raf: number;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const track = trackRef.current;
      if (track) {
        const half = track.scrollWidth / 2;
        if (half > 0) {
          const base = window.innerWidth * 0.05;
          const target = holding.current ? base * SKIM_MULTIPLIER : base;
          /* ramp hard on the way up so the skim feels instant, and coast
             back down a little slower so it does not snap on release */
          const k = holding.current ? 6 : 3.2;
          speed.current += (target - speed.current) * Math.min(1, dt * k);

          pos.current -= speed.current * dt;
          if (pos.current <= -half) pos.current += half;
          track.style.transform = `translate3d(${pos.current}px,0,0)`;

          /* directional blur, tied to how fast the strip is actually moving:
             nothing at the idle crawl, full smear at the top of the skim */
          const t = Math.min(
            1,
            Math.max(
              0,
              (speed.current - base * 1.5) / (base * (SKIM_MULTIPLIER - 1.5))
            )
          );
          const std = MAX_BLUR * t;
          if (blurRef.current) {
            blurRef.current.setAttribute("stdDeviation", `${std.toFixed(2)} 0`);
          }
          /* only pay for the filter while it is doing something */
          const want = std > 0.05;
          if (want !== blurOn.current && stageRef.current) {
            stageRef.current.style.filter = want ? "url(#skim-blur)" : "";
            stageRef.current.style.willChange = want ? "filter" : "";
            blurOn.current = want;
          }
        }
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const stopHold = () => {
    holding.current = false;
    setHeld(false);
  };

  return (
    <section
      id="work"
      className="relative select-none pt-[clamp(70px,9vw,190px)] pb-[clamp(22px,2.4vw,54px)]"
    >
      {/* the blur kernel is horizontal only, so the strip smears along its
          direction of travel instead of going soft in every direction */}
      <svg className="pointer-events-none absolute size-0" aria-hidden>
        <filter
          id="skim-blur"
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur ref={blurRef} stdDeviation="0 0" />
        </filter>
      </svg>

      <div className="gut flex items-end justify-between">
        <MaskReveal inView amount={0.5}>
          <h2
            className="display whitespace-nowrap text-[var(--fg)]"
            style={{ fontSize: "clamp(40px, 11vw, 230px)" }}
          >
            Selected Work
          </h2>
        </MaskReveal>
        <span className="micro pb-[0.4em] text-[var(--fg-45)]">
          {String(WORKS.length).padStart(2, "0")} Projects
        </span>
      </div>

      <div
        ref={stageRef}
        data-skim-stage
        className="mt-[clamp(26px,3vw,64px)] overflow-hidden md:cursor-none"
        onPointerMove={(e) => {
          mx.set(e.clientX);
          my.set(e.clientY);
        }}
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => {
          setHovering(false);
          stopHold();
        }}
        onPointerDown={(e) => {
          if (e.button === 0) {
            holding.current = true;
            setHeld(true);
          }
        }}
        onPointerUp={stopHold}
        onPointerCancel={stopHold}
      >
        {/* The strip eases back while it runs, so the speed reads as distance.
            Written as an explicit transform rather than a `scale-*` utility:
            Tailwind v4 compiles those to the standalone `scale` property,
            which `transition-transform` does not animate, so the step would
            snap instead of easing. */}
        <div
          className="origin-center"
          style={{
            transform: held ? "scale(0.9)" : "scale(1)",
            transition: `transform 900ms ${cubic(EASE_OUT)}`,
          }}
        >
          <div
            ref={trackRef}
            className="flex w-max gap-[clamp(10px,1.1vw,26px)] will-change-transform"
          >
            {[...WORKS, ...WORKS].map((work, i) => (
              <div
                key={i}
                className="h-[clamp(180px,34vh,460px)] shrink-0 overflow-hidden bg-[var(--fg-14)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={work.src}
                  alt={work.alt}
                  draggable={false}
                  decoding="async"
                  loading={i < 6 ? "eager" : "lazy"}
                  className="aspect-[2/1] h-full w-auto object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* hold-to-skim cursor chip */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[60] hidden md:block"
        style={{ x: sx, y: sy }}
        animate={{ opacity: hovering ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <div
          className={`micro -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-accent px-[1.6em] py-[1em] text-white transition-transform duration-300 ${
            held ? "scale-[0.86]" : "scale-100"
          }`}
        >
          {held ? "Skimming" : "Hold to skim"}
        </div>
      </motion.div>
    </section>
  );
}
