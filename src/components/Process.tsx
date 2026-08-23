"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { MaskReveal } from "./reveal";
import {
  IconAgreement,
  IconCall,
  IconPack,
  IconShipped,
} from "./ProcessIcons";

const STEPS = [
  {
    title: "Discovery Call",
    desc: "A short call about what you need, when you need it and what it should cost. No deck, no pitch, no pressure to decide on the spot.",
    Icon: IconCall,
    /* tilt alternates down the list so the column never reads symmetrical */
    rotate: 9,
    drift: "-12%",
  },
  {
    title: "Deal Confirmation & Agreement",
    desc: "One proposal covering price, timeline and exactly what gets delivered. Once it is signed, the number does not move.",
    Icon: IconAgreement,
    rotate: -7,
    drift: "8%",
  },
  {
    title: "Client Starter Pack",
    desc: "An onboarding pack with the schedule, the checklists and a short list of everything I need from you before work starts.",
    Icon: IconPack,
    rotate: 11,
    drift: "-5%",
  },
  {
    title: "Website / Software Delivered",
    desc: "Designed, built, tested and launched. Revisions are folded in along the way, and you get the keys plus a walkthrough at the end.",
    Icon: IconShipped,
    rotate: -9,
    drift: "13%",
  },
];

function Step({ step, index }: { step: (typeof STEPS)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  /* Everything in the row is tied to where the row sits in the viewport, so
     it plays forwards on the way down and backwards on the way up. The window
     is deliberately long and the spring soft: the row should come up over most
     of a screen of scrolling rather than snapping on. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 1", "start 0.28"],
  });

  const p = useSpring(scrollYProgress, {
    stiffness: 46,
    damping: 24,
    mass: 1,
    restDelta: 0.0004,
  });

  const textOpacity = useTransform(p, [0, 1], [0.12, 1]);
  const textY = useTransform(p, [0, 1], [22, 0]);

  const iconOpacity = useTransform(p, [0.12, 0.6], [0, 1]);
  const iconScale = useTransform(p, [0.12, 1], [0.55, 1]);
  const iconRotate = useTransform(p, [0.12, 1], [0, step.rotate]);
  const iconY = useTransform(p, [0.12, 1], [48, 0]);

  return (
    <div
      ref={ref}
      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-[clamp(14px,1.6vw,34px)] gap-y-[clamp(14px,1.6vw,34px)] border-t border-[var(--rule)] py-[clamp(26px,3.2vw,68px)] md:grid-cols-[minmax(0,1fr)_clamp(60px,7vw,132px)_minmax(0,1.15fr)]"
    >
      {/* number + title */}
      <motion.div
        className="flex items-baseline gap-[clamp(12px,1.4vw,30px)]"
        style={{ opacity: textOpacity, y: textY }}
      >
        <span className="micro shrink-0 text-accent">
          {String(index + 1).padStart(2, "0")}
        </span>
        <p className="text-[length:var(--fs-step)] font-medium leading-[1.05] tracking-[-0.02em] text-[var(--fg)]">
          {step.title}
        </p>
      </motion.div>

      {/* the icon for this step — beside the title on a phone, in its own
          centre lane on desktop */}
      <div className="flex justify-center">
        <motion.div
          style={{
            opacity: iconOpacity,
            scale: iconScale,
            rotate: iconRotate,
            y: iconY,
            x: step.drift,
          }}
          className="text-[var(--fg)]"
        >
          <step.Icon className="size-[clamp(52px,5.2vw,110px)]" />
        </motion.div>
      </div>

      {/* the description, always on the page */}
      <motion.p
        className="col-span-2 max-w-[46ch] text-[length:var(--fs-body)] leading-[1.42] text-[var(--fg-70)] md:col-span-1"
        style={{ opacity: textOpacity, y: textY }}
      >
        {step.desc}
      </motion.p>
    </div>
  );
}

export default function Process() {
  return (
    <section id="process" className="gut pt-[clamp(50px,6vw,130px)] pb-[clamp(80px,10vw,220px)]">
      {/* centred, at the 1531px measure the frame sets on 2564 */}
      <MaskReveal inView amount={0.4} className="text-center">
        <h2
          className="display whitespace-nowrap text-[var(--fg)]"
          style={{ fontSize: "clamp(34px, 8.138vw, 205px)" }}
        >
          How the <span className="text-accent">Process</span> Flows
        </h2>
      </MaskReveal>

      <div className="mt-[clamp(46px,6vw,140px)] border-b border-[var(--rule)]">
        {STEPS.map((step, i) => (
          <Step key={step.title} step={step} index={i} />
        ))}
      </div>
    </section>
  );
}
