"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { PACKAGES, PRICING_NOTES, type Package } from "@/lib/services";
import { MaskReveal } from "./reveal";

/* ---------------------------------------------------------------------------
   The four services as cards.

   The three individual services sit in a row; the Complete Digital System
   spans all three underneath, because it is literally the others bought
   together. The layout is the argument, so no "most popular" badge has to do
   that job.

   A card is a ruled surface, not a floating rounded box: square corners and
   hairlines, the same vocabulary as the rest of the site. Its one loud moment
   is the price, set in Thunder in the accent, which picks the orange back up
   from "Costs" in the heading above.

   Everything mixes off --fg rather than a literal colour, so the cards travel
   with the page when it flips from ink to paper.

   Text sits at --fg-70 and not --fg-45: over the card surface, which
   composites to #141413 on ink, 45% lands at 4.12:1, under AA for labels this
   small, while 70% clears it at 8.4:1.
--------------------------------------------------------------------------- */

const CARD =
  "flex flex-col border border-[var(--rule)] bg-[var(--surface)] p-[clamp(20px,1.75vw,40px)] transition-[background-color,border-color] duration-200 ease-out hover:border-[var(--fg-28)] hover:bg-[var(--surface-hi)]";

const PRICE_SIZE = "clamp(38px, 3.5vw, 76px)";

/* index, name, price. The lead line is always emitted, blank when a package
   has no lead word, so every price in a row sits on one baseline and the rule
   under it lands at the same height across all three cards. The range tail
   runs alongside the figure rather than under it, for the same reason. */
function Head({ pack, index }: { pack: Package; index: number }) {
  return (
    <>
      <span className="micro text-[var(--fg-70)]">
        {String(index + 1).padStart(2, "0")}
      </span>

      <h3 className="mt-[0.75em] text-[length:var(--fs-step)] font-medium leading-[1.05] tracking-[-0.02em] text-[var(--fg)]">
        {pack.name}
      </h3>

      <div className="mt-[clamp(14px,1.2vw,26px)]">
        <span className="micro block text-[var(--fg-70)]">
          {pack.priceLead ?? " "}
        </span>
        <span className="mt-[0.1em] flex flex-wrap items-baseline gap-x-[0.7em]">
          <span
            className="display whitespace-nowrap text-accent"
            style={{ fontSize: PRICE_SIZE }}
          >
            {pack.price}
          </span>
          {pack.priceTail && (
            <span className="micro text-[var(--fg-70)]">{pack.priceTail}</span>
          )}
        </span>
      </div>
    </>
  );
}

function Includes({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-[0.62em]">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-baseline gap-[0.7em] text-[length:var(--fs-small)] leading-[1.4] text-[var(--fg-70)]"
        >
          {/* a marker, not information, so the item text carries all of it */}
          <span aria-hidden className="shrink-0 text-[var(--fg-28)]">
            +
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* the "Best for" / note line, pinned to the foot of the card above a rule, so
   the uneven space left by shorter lists reads as structure rather than slack */
function Foot({ pack }: { pack: Package }) {
  const body = pack.bestFor ?? pack.note;
  if (!body) return null;

  return (
    <p className="mt-[clamp(20px,1.8vw,38px)] border-t border-[var(--rule)] pt-[clamp(14px,1.2vw,24px)] text-[length:var(--fs-small)] leading-[1.45] text-[var(--fg-70)]">
      {pack.bestFor && (
        <span className="micro text-[var(--fg-70)]">Best for </span>
      )}
      {body}
    </p>
  );
}

function Card({ pack, index }: { pack: Package; index: number }) {
  const ref = useRef<HTMLElement>(null);

  /* Same scroll-linked arrival the process rows use, so the two pages read as
     one site: long window, soft spring, reversible on the way back up. Cards
     sharing a row share a scroll position, so the stagger comes from shifting
     each card's slice of that progress rather than from a delay. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 1", "start 0.4"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 46,
    damping: 24,
    mass: 1,
    restDelta: 0.0004,
  });

  const from = (index % 3) * 0.1;
  const opacity = useTransform(p, [from, from + 0.8], [0.1, 1]);
  const y = useTransform(p, [from, from + 0.8], [26, 0]);

  /* prefers-reduced-motion is handled in globals.css rather than here: swapping
     this style object for static numbers does not detach the motion value that
     is already bound to the element, so the card stays parked at 0.1. */
  const motionStyle = { opacity, y };

  /* The combined package spans the row on desktop and lays its own content out
     in three, echoing the three cards above it.

     Children stay in reading order (head, summary, includes, foot) and are
     placed into cells explicitly at lg. Wrapping the summary and foot in a
     shared column instead would put "Best for" ahead of the list on every
     screen narrower than that. */
  if (pack.wide) {
    return (
      <motion.article
        ref={ref}
        style={motionStyle}
        className={`${CARD} lg:col-span-3 lg:grid lg:grid-cols-3 lg:grid-rows-[1fr_auto] lg:gap-x-[clamp(20px,2.4vw,64px)]`}
      >
        <div className="flex flex-col lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <Head pack={pack} index={index} />
        </div>

        <p className="mt-[clamp(18px,1.5vw,34px)] max-w-[46ch] border-t border-[var(--rule)] pt-[clamp(16px,1.4vw,30px)] text-[length:var(--fs-body)] leading-[1.42] text-[var(--fg-70)] lg:col-start-2 lg:row-start-1 lg:mt-0 lg:border-t-0 lg:pt-0">
          {pack.summary}
        </p>

        <div className="mt-[clamp(18px,1.5vw,32px)] lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:mt-0">
          <Includes items={pack.includes} />
        </div>

        <div className="lg:col-start-2 lg:row-start-2">
          <Foot pack={pack} />
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article ref={ref} style={motionStyle} className={CARD}>
      <Head pack={pack} index={index} />

      <p className="mt-[clamp(18px,1.5vw,34px)] border-t border-[var(--rule)] pt-[clamp(16px,1.4vw,30px)] text-[length:var(--fs-body)] leading-[1.42] text-[var(--fg-70)]">
        {pack.summary}
      </p>

      <div className="mt-[clamp(18px,1.5vw,32px)]">
        <Includes items={pack.includes} />
      </div>

      {/* pushes the foot to the bottom edge so card feet line up across the row */}
      <div className="mt-auto">
        <Foot pack={pack} />
      </div>
    </motion.article>
  );
}

export default function Packages() {
  return (
    <section id="packages" className="gut py-[clamp(70px,9vw,190px)]">
      <MaskReveal inView amount={0.4} className="text-center">
        <h2
          className="display whitespace-nowrap text-[var(--fg)]"
          style={{ fontSize: "clamp(34px, 8.138vw, 205px)" }}
        >
          What it <span className="text-accent">Costs</span>
        </h2>
      </MaskReveal>

      {/* 2x2 on tablet, then 3 across with the combined package spanning */}
      <div className="mt-[clamp(46px,6vw,140px)] grid grid-cols-1 gap-[clamp(12px,1vw,24px)] md:grid-cols-2 lg:grid-cols-3">
        {PACKAGES.map((pack, i) => (
          <Card key={pack.name} pack={pack} index={i} />
        ))}
      </div>

      <div className="mt-[clamp(26px,3vw,60px)] flex flex-col gap-[0.8em] md:flex-row md:gap-[clamp(30px,4vw,90px)]">
        {PRICING_NOTES.map((note) => (
          <p
            key={note}
            className="max-w-[58ch] text-[length:var(--fs-small)] leading-[1.45] text-[var(--fg-70)]"
          >
            {note}
          </p>
        ))}
      </div>
    </section>
  );
}
