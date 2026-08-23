"use client";

import { motion } from "motion/react";
import { EASE_HOUSE } from "@/lib/anim";
import { generateField } from "@/lib/datafield";

/* ---------------------------------------------------------------------------
   Two layers, like a spec sheet with the verdict stamped over it.

   The GROUND is a full-bleed data field: the section's own copy run through
   a seeded corruption pass (src/lib/datafield.ts), set in mono inside a
   hairline frame 24px off the section edges. Five staggered columns — four
   under 1280px, two under 768px — at 18% ink, so it reads as texture unless
   you lean in. The field is aria-hidden and inert; the real copy is served
   to screen readers once, clean.

   The FIGURE is the six display words, straight off the Figma frame
   "Desktop - 3": every x/y is the raw frame coordinate, scaled by --fig
   (100vw / 2564). They render after the field, so they sit on top of it
   and may overlap it freely — that is the effect.

   Display words: Thunder Bold LC 299.755px, leading normal (0.921em on this
   font, which is what makes the raw `top` values line up).
--------------------------------------------------------------------------- */

const WORD_SIZE = 299.755;

const WORDS = [
  { text: "Design", x: 112, y: 126, accent: true },
  { text: "Driven", x: 1112, y: 305, accent: false },
  { text: "Code", x: 1935, y: 626, accent: true },
  { text: "Without", x: 112, y: 842, accent: false },
  { text: "Any", x: 711, y: 1268, accent: false },
  { text: "Handoffs", x: 1416, y: 1406, accent: false },
];

const PARAS = [
  "Most websites are drawn by one person, built by a second and filled with words from a third. Every handover costs a little of the original idea.",
  "By the time the site is live, nobody involved can point at the thing they set out to make. The gap between the mockup and the production build is where good work quietly dies.",
  "Here the layout, the code and the copy come off the same desk. There is nothing to translate, no spec to misread, and no version of the design that only exists in someone else's head.",
  "Design goes first. Type, spacing, colour and the order things appear in are settled before a single component gets written.",
  "The build is then shaped to fit that, not the other way round. When a layout needs a grid or a scroll behaviour that no framework ships with, it gets written by hand.",
  "The drawing is the brief. What launches is what was drawn, at the same weights, the same measure and the same rhythm, on every screen it was drawn for.",
  "Every page is written by hand. No page builders, no bought themes, no stack of plugins holding a homepage together.",
  "Markup stays semantic. Pages stay quick on a bad connection. Everything works from the keyboard and reads correctly out loud for anyone on a screen reader.",
  "Those are not extras bolted on at the end for a compliance badge. They cost a fraction to build in at the start compared to retrofitting them after launch.",
  "Working with one person means fewer meetings and much faster answers. Ask for a change and it happens that day rather than in the next sprint.",
  "No account manager relaying your notes. No developer explaining why the design cannot be built. No estimate that doubles once the file reaches engineering.",
  "You talk to the person doing the work. Scope, price and timeline are agreed once, in writing, and the work answers for itself from there.",
  "One person carries the whole thread, from the first sketch through to the day it goes live, and stays reachable long after that.",
  "Nothing gets quietly simplified in the build because it turned out to be awkward to code. If it was worth drawing, it is worth building properly.",
  "What you end up with is a site you own outright, in files you can read, with no monthly licence quietly keeping the homepage alive.",
  "Most projects run four to eight weeks from the first call to launch, depending on how many pages there are and how ready the content is.",
];

/* generated once at module load with a fixed seed — the server and every
   client render byte-identical strings, so hydration never mismatches */
const FIELD = generateField(PARAS, 0x51a7e);

/* on phones the words place themselves left / right / centre down the
   section, so the scatter of the frame survives without its coordinates */
const MOBILE_ALIGN = [
  "self-start",
  "self-end",
  "self-center",
  "self-start",
  "self-center",
  "self-end",
];

/* column tops staggered so the field never reads as a neat grid */
const COL_STAGGER = [0, 60, 20, 90, 40];
/* five columns, four under 1280px, two under 768px */
const COL_VIS = ["", "", "hidden md:block", "hidden md:block", "hidden xl:block"];

/* per-column timings for the glitch pass: co-prime-ish durations and
   negative delays, so no two columns ever tick or drift in step */
const COL_JITTER = [
  { dur: "8.9s", delay: "-2.1s" },
  { dur: "11.3s", delay: "-5.4s" },
  { dur: "9.7s", delay: "-0.8s" },
  { dur: "12.9s", delay: "-7.2s" },
  { dur: "10.1s", delay: "-3.9s" },
];
const COL_DRIFT = [
  { dur: "56s", delay: "0s" },
  { dur: "44s", delay: "-18s" },
  { dur: "63s", delay: "-31s" },
  { dur: "49s", delay: "-9s" },
  { dur: "71s", delay: "-40s" },
];

const fig = (n: number) => `calc(var(--fig) * ${n})`;

/* the ground: fills whatever positioned box it is rendered into */
function DataField() {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 select-none"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1.4, ease: [...EASE_HOUSE] }}
    >
      {/* the field's crop box: 24px off the edges on desktop, stepping down
          to 16px and 12px so it never eats a phone screen. No stroke — the
          field bleeds off into the dark instead of sitting in a drawn box. */}
      <div className="df-flicker absolute inset-3 overflow-hidden md:inset-4 lg:inset-6">
        <div
          className="df-fringe flex h-full font-mono"
          style={{
            gap: "clamp(24px, 3vw, 64px)",
            fontSize: "clamp(9px, 0.72vw, 12px)",
            lineHeight: 1.8,
            letterSpacing: "0.075em",
            color: "color-mix(in oklab, var(--fg) 18%, transparent)",
          }}
        >
          {FIELD.map((col, i) => (
            <div
              key={i}
              className={`df-drift min-w-0 flex-1 ${COL_VIS[i]}`}
              style={{
                paddingTop: COL_STAGGER[i],
                animationDuration: COL_DRIFT[i].dur,
                animationDelay: COL_DRIFT[i].delay,
              }}
            >
              <div
                className="df-jitter"
                style={{
                  animationDuration: COL_JITTER[i].dur,
                  animationDelay: COL_JITTER[i].delay,
                }}
              >
                {col.map((b, j) => (
                  <p
                    key={j}
                    className="whitespace-pre-wrap"
                    style={{
                      paddingLeft: `${b.indent.toFixed(2)}ch`,
                      marginBottom: "1.8em",
                    }}
                  >
                    {b.text}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* the tube itself, painted over the text: rows and the rolling band */}
        <div className="df-scanlines" />
        <div className="df-scanband" />
      </div>
    </motion.div>
  );
}

export default function Manifesto() {
  return (
    <section id="method" className="relative">
      {/* the copy once, readable, for screen readers on every breakpoint —
          it must live outside the display-none'd desktop frame, or phones
          would serve readers nothing but the six display words */}
      <div className="sr-only">
        {PARAS.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {/* ---- the frame, reproduced ---- */}
      <div
        className="relative hidden overflow-hidden lg:block"
        style={{ height: fig(1790) }}
      >
        <DataField />

        {/* the figure: display words over the field */}
        {WORDS.map((w, i) => (
          <motion.div
            key={`w${i}`}
            className="absolute overflow-hidden"
            style={{ left: fig(w.x), top: fig(w.y) }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.7 }}
          >
            <motion.p
              className={`font-thunder whitespace-nowrap font-bold uppercase leading-[0.921] ${
                w.accent ? "text-accent" : "text-[var(--fg)]"
              }`}
              style={{ fontSize: fig(WORD_SIZE) }}
              variants={{
                hidden: { y: "108%" },
                visible: {
                  y: "0%",
                  transition: { duration: 1.15, ease: [...EASE_HOUSE] },
                },
              }}
            >
              {w.text}
            </motion.p>
          </motion.div>
        ))}
      </div>

      {/* ---- narrow screens: just the six words, scattered over the field.
           The copy itself is desktop texture and screen-reader material; on a
           phone it would be a wall of grey, so it does not render here. ---- */}
      <div className="relative overflow-hidden lg:hidden">
        <DataField />
        <div className="gut relative flex flex-col gap-[9vw] py-[16vw]">
          {WORDS.map((w, i) => (
            <div key={i} className={`overflow-hidden ${MOBILE_ALIGN[i]}`}>
              <p
                className={`font-thunder whitespace-nowrap text-[16vw] font-bold uppercase leading-[0.921] ${
                  w.accent ? "text-accent" : "text-[var(--fg)]"
                }`}
              >
                {w.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
