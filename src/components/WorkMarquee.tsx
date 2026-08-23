"use client";

import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type WheelEvent,
} from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cubic, EASE_OUT } from "@/lib/anim";
import { TEXT_LINK, TEXT_LINK_RULE } from "@/lib/ui";
import { MaskReveal } from "./reveal";

type Work = {
  src: string;
  name: string;
  /* the live site; absent when there is nothing public to point at */
  href?: string;
  alt: string;
};

const WORKS: Work[] = [
  {
    src: "/work/crescent-car-check.webp",
    name: "Crescent Car Check",
    href: "https://crescentcarcheck.com/",
    alt: "Crescent Car Check website. The hero reads 'Book the UAE's best pre-purchase car inspection' beside a branded inspection van.",
  },
  {
    src: "/work/voidform.webp",
    name: "VoidForm",
    href: "https://voidform-seven.vercel.app/",
    alt: "VoidForm website. A blue hero with an outlined 'Developing' marquee running over the silhouette of a film camera.",
  },
  {
    src: "/work/norhus-real-estate.webp",
    name: "Nørhus Real Estate",
    href: "https://norhus-real-estate.vercel.app/",
    alt: "Nørhus Real Estate website. A black and cream hero with 'Real estate in Copenhagen' set along a curve.",
  },
  {
    src: "/work/untold-archives.webp",
    name: "Untold Archives",
    href: "https://untoldarchives.com/",
    alt: "Untold Archives website. A dark hero with an old television showing 'Welcome to the archives'.",
  },
  {
    src: "/work/perch.webp",
    name: "Perch Website Tracker",
    href: "https://perch-website-tracker.vercel.app/",
    alt: "Perch Website Tracker landing page. The headline reads 'Check your analytics without the maze' above a dashboard preview.",
  },
  {
    src: "/work/kairos-k01.webp",
    name: "Kairos Watch",
    href: "https://kairos-watch.vercel.app/",
    alt: "Kairos Watch website. The K-01 watch face in close-up on a dark hero.",
  },
  {
    src: "/work/superior-ink.webp",
    name: "Superior Ink",
    alt: "Superior Ink website. A third party logistics hero with stacked shipping cartons on a pallet.",
  },
  {
    src: "/work/mubarak-auto.webp",
    name: "Mubarak Auto",
    href: "https://mubarakauto.ae/",
    alt: "Mubarak Auto website. The hero reads 'Premium auto parts at the best prices in UAE' next to the Mubarak Auto badge.",
  },
  {
    src: "/work/discontinued.webp",
    name: "Discontinued",
    href: "https://discontinued-kappa.vercel.app/",
    alt: "Discontinued website. An illustrated hero with a classic iPod and the line 'The most elegant that got lost'.",
  },
  {
    src: "/work/virdis-supplement.webp",
    name: "Virdis Supplement",
    href: "https://virdis-supplement-demo.vercel.app/",
    alt: "Virdis Supplement website. The Virdis wordmark in an italic serif with capsules floating around it.",
  },
];

/* how much faster the track runs while the pointer is held down */
const SKIM_MULTIPLIER = 24;
/* horizontal blur, in px of standard deviation, at full skim speed. Enough
   to read as speed, not so much that the work stops being legible. */
const MAX_BLUR = 8;

/* A press that travels further than this, or lasts longer than this, was a
   skim or a drag, and the click that follows it must not open a project. */
const CLICK_MAX_MOVE = 8;
const CLICK_MAX_MS = 200;

/* how far past its start the strip may sit before it wraps: just over the
   widest page gutter (58px), so tile one can rest on the gutter */
const WRAP_SLACK = 64;

type Press = {
  /* where the press started, for the did-it-move test */
  x: number;
  y: number;
  /* where the finger was last frame, for scrubbing by the difference */
  lx: number;
  t: number;
  touch: boolean;
  moved: boolean;
};

export default function WorkMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement>(null);

  const pos = useRef(0);
  const speed = useRef(0);
  const holding = useRef(false);
  const blurOn = useRef(false);
  /* a keyboard or focus move in flight: the strip eases to this offset */
  const glide = useRef<number | null>(null);
  /* the strip stands still while keyboard focus is inside it */
  const paused = useRef(false);
  const press = useRef<Press | null>(null);
  const suppressClick = useRef(false);
  const reducedRef = useRef(false);

  const [hovering, setHovering] = useState(false);
  const [overLink, setOverLink] = useState(false);
  const [held, setHeld] = useState(false);
  const [reduced, setReduced] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 500, damping: 42 });
  const sy = useSpring(my, { stiffness: 500, damping: 42 });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      reducedRef.current = mq.matches;
      setReduced(mq.matches);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

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
          const still =
            reducedRef.current || paused.current || glide.current !== null;
          const target = still
            ? 0
            : holding.current
              ? base * SKIM_MULTIPLIER
              : base;
          /* ramp hard on the way up so the skim feels instant, and coast
             back down a little slower so it does not snap on release */
          const k = holding.current ? 6 : 3.2;
          speed.current += (target - speed.current) * Math.min(1, dt * k);
          /* settle fully rather than creeping by fractions of a pixel forever */
          if (target === 0 && Math.abs(speed.current) < 0.2) speed.current = 0;

          pos.current -= speed.current * dt;

          if (glide.current !== null) {
            speed.current = 0;
            const d = glide.current - pos.current;
            if (Math.abs(d) < 0.5 || reducedRef.current) {
              pos.current = glide.current;
              glide.current = null;
            } else {
              pos.current += d * Math.min(1, dt * 8);
            }
          }

          /* Wrap a copy-width at a time so the loop is seamless. The upper
             bound is a little above zero rather than zero itself, so the
             first tile can sit on the page gutter under keyboard focus
             without the strip jumping to its ghost copy. */
          if (pos.current <= -half) pos.current += half;
          if (pos.current > WRAP_SLACK) pos.current -= half;
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

  /* ---- pointer: hold to skim, drag to scrub on touch, clean click to open ---- */

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    suppressClick.current = false;
    const touch = e.pointerType === "touch";
    press.current = {
      x: e.clientX,
      y: e.clientY,
      lx: e.clientX,
      t: performance.now(),
      touch,
      moved: false,
    };
    /* a press that starts on a project name is a click in waiting, not a
       skim; a finger scrubs the strip instead of skimming it */
    const onLink = !!(e.target as Element).closest("a");
    if (!touch && !onLink) {
      holding.current = true;
      setHeld(true);
    }
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    mx.set(e.clientX);
    my.set(e.clientY);
    const p = press.current;
    if (!p) return;
    if (Math.hypot(e.clientX - p.x, e.clientY - p.y) > CLICK_MAX_MOVE) {
      p.moved = true;
    }
    if (p.touch) {
      pos.current += e.clientX - p.lx;
      p.lx = e.clientX;
      glide.current = null;
    }
  };

  const endPress = () => {
    const p = press.current;
    if (p) {
      const heldFor = performance.now() - p.t;
      if (p.moved || heldFor > CLICK_MAX_MS) suppressClick.current = true;
      press.current = null;
    }
    stopHold();
  };

  const onClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    /* keyboard activation arrives with no press behind it and passes through */
    if (suppressClick.current) {
      e.preventDefault();
      e.stopPropagation();
      suppressClick.current = false;
    }
  };

  /* ---- keyboard: arrows step the strip, Tab walks the projects ---- */

  const tileAt = (i: number) =>
    trackRef.current?.querySelectorAll<HTMLElement>("[data-tile]")[i] ?? null;

  /* ease the strip so tile i sits on the left page gutter */
  const bringIntoView = (i: number) => {
    const track = trackRef.current;
    const tile = tileAt(i);
    if (!track || !tile) return;
    const half = track.scrollWidth / 2;
    /* the page gutter, resolved to px off the heading row that wears it */
    const gutter = headRef.current
      ? parseFloat(getComputedStyle(headRef.current).paddingLeft) || 0
      : 0;
    let target = gutter - tile.offsetLeft;
    while (target <= -half) target += half;
    while (target > WRAP_SLACK) target -= half;
    glide.current = target;
  };

  /* focus the next linked project in the given direction, wrapping; a tile
     with no live site is scrolled past, since there is nothing to open */
  const focusTile = (from: number, dir: 1 | -1) => {
    const n = WORKS.length;
    for (let step = 1; step <= n; step++) {
      const idx = (((from + dir * step) % n) + n) % n;
      const link = tileAt(idx)?.querySelector<HTMLElement>("a");
      if (link) {
        link.focus({ preventScroll: true });
        bringIntoView(idx);
        return;
      }
    }
  };

  const focusedIndex = () => {
    const tiles = Array.from(
      trackRef.current?.querySelectorAll<HTMLElement>("[data-tile]") ?? []
    );
    return tiles.findIndex((t) => t.contains(document.activeElement));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const cur = focusedIndex();
    if (e.key === "ArrowRight") focusTile(cur < 0 ? -1 : cur, 1);
    else focusTile(cur < 0 ? 0 : cur, -1);
  };

  const onFocus = (e: FocusEvent<HTMLDivElement>) => {
    /* the browser scrolls an overflow-hidden box to reveal a focused child,
       which would shear the strip off its transform; undo that first */
    if (stageRef.current) stageRef.current.scrollLeft = 0;
    /* Only keyboard focus holds the strip and eases the tile in. A press
       focuses the link too, and moving the strip then would pull it out
       from under the pointer before the click lands, and leave the strip
       frozen after it. */
    const target = e.target as HTMLElement;
    const keyboard = !press.current && target.matches(":focus-visible");
    paused.current = keyboard;
    if (!keyboard) return;
    const tile = target.closest<HTMLElement>("[data-tile]");
    if (tile) {
      const i = Number(tile.dataset.tile);
      if (!Number.isNaN(i)) bringIntoView(i);
    }
  };

  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    const next = e.relatedTarget as HTMLElement | null;
    paused.current = !!(
      next && stageRef.current?.contains(next) && next.matches(":focus-visible")
    );
  };

  /* a sideways wheel or trackpad swipe scrubs the strip directly */
  const onWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      pos.current -= e.deltaX;
      glide.current = null;
    }
  };

  const showChip = hovering && !overLink;

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

      <div ref={headRef} className="gut flex items-end justify-between">
        <MaskReveal inView amount={0.5}>
          <h2
            className="display whitespace-nowrap text-[var(--fg)]"
            style={{ fontSize: "clamp(40px, 11vw, 230px)" }}
          >
            Selected Work
          </h2>
        </MaskReveal>
        <span className="micro pb-[0.4em] text-[var(--fg-70)]">
          {String(WORKS.length).padStart(2, "0")} Projects
        </span>
      </div>

      <div
        ref={stageRef}
        data-skim-stage
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Selected work. Use the left and right arrow keys to move between projects."
        className="mt-[clamp(26px,3vw,64px)] overflow-hidden [touch-action:pan-y] focus-visible:outline-offset-[-2px] md:cursor-none"
        onPointerMove={onPointerMove}
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => {
          setHovering(false);
          setOverLink(false);
          endPress();
        }}
        onPointerDown={onPointerDown}
        onPointerUp={endPress}
        onPointerCancel={endPress}
        onClickCapture={onClickCapture}
        onDragStart={(e) => e.preventDefault()}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        onWheel={onWheel}
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
            {[...WORKS, ...WORKS].map((work, i) => {
              /* the second copy only exists so the loop is seamless: it is
                 invisible to readers and unreachable from the keyboard */
              const ghost = i >= WORKS.length;
              return (
                <div
                  key={i}
                  data-tile={ghost ? undefined : i}
                  aria-hidden={ghost || undefined}
                  className="flex shrink-0 flex-col"
                >
                  {/* a tile is twice as wide as it is tall; the 40vw cap
                      keeps one within the screen on a phone, where 34vh
                      would set it half again as wide as the viewport */}
                  <div className="h-[min(clamp(180px,34vh,460px),40vw)] overflow-hidden bg-[var(--fg-14)]">
                    <Image
                      src={work.src}
                      alt={ghost ? "" : work.alt}
                      width={1600}
                      height={800}
                      sizes="(max-width: 640px) 70vw, 920px"
                      draggable={false}
                      loading={i < 4 ? "eager" : "lazy"}
                      className="aspect-[2/1] h-full w-auto object-cover"
                    />
                  </div>

                  {/* the name row: the whole name is the link. Tall enough
                      to be a thumb target, which also spaces the strip off
                      the CTA beneath it. */}
                  <div
                    className="flex"
                    onPointerEnter={() => setOverLink(true)}
                    onPointerLeave={() => setOverLink(false)}
                  >
                    {work.href ? (
                      <a
                        href={work.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={ghost ? -1 : 0}
                        draggable={false}
                        className={`${TEXT_LINK} inline-flex min-h-[44px] items-center cursor-pointer`}
                      >
                        <span className="relative inline-flex items-center gap-[0.6em]">
                          {work.name}
                          <span aria-hidden>&#8599;</span>
                          <span className={TEXT_LINK_RULE} />
                        </span>
                        <span className="sr-only">, opens in a new tab</span>
                      </a>
                    ) : (
                      <span className="micro inline-flex min-h-[44px] items-center text-[var(--fg-70)]">
                        {work.name}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* hold-to-skim cursor chip. Starts invisible and hidden: it only has
          a place to be once the pointer is over the strip, and it steps out
          of the way over a project name so the link stays readable. */}
      {!reduced && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-[60] hidden md:block"
          style={{ x: sx, y: sy }}
          initial={{ opacity: 0, visibility: "hidden" }}
          animate={
            showChip
              ? { opacity: 1, visibility: "visible" }
              : { opacity: 0, transitionEnd: { visibility: "hidden" } }
          }
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
      )}
    </section>
  );
}
