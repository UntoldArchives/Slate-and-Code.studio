"use client";

import { MaskReveal, WordsReveal } from "./reveal";

/*
  Set from the Figma frame "Desktop - 5" (2564 x 1683):

    heading    Thunder Bold 162.828px          -> 6.351vw
    statement  Neue Montreal Medium 108px,
               1538px measure, -3.24px track,
               94.1% leading, two lines         -> 4.212vw / 59.98vw / -0.03em

  No background of its own. <Invert /> is watching this section's id and
  driving --p-invert on :root, which flips the page from ink to paper
  underneath everything at once.
*/

/* Verbatim from the frame. The line breaks in the design fall out of this
   exact wording at this exact measure, so it is not to be "improved". */
const STATEMENT = [
  "A studio of one, there is no handoff where the idea gets watered down.",
  "I care, in equal measure, about how a thing looks, how it is built, and how it makes someone feel.",
];

export default function About() {
  return (
    <section
      id="about"
      className="gut flex min-h-[62svh] flex-col py-[clamp(52px,8.32vh,120px)] lg:min-h-svh"
    >
      <MaskReveal inView amount={0.4}>
        <h2
          className="display whitespace-nowrap text-[var(--fg)]"
          style={{ fontSize: "clamp(30px, 6.351vw, 160px)" }}
        >
          About the <span className="text-accent">Studio</span>
        </h2>
      </MaskReveal>

      <div className="flex flex-1 items-center justify-center py-[clamp(30px,5vh,90px)]">
        <div className="w-[min(59.98vw,100%)] max-lg:w-full">
          {STATEMENT.map((line, i) => (
            <WordsReveal
              key={i}
              inView
              delay={i * 0.28}
              stagger={0.03}
              text={line}
              className="text-center text-[length:var(--fs-about)] font-medium leading-[0.941] tracking-[-0.03em] text-[var(--fg)]"
            />
          ))}
        </div>
      </div>

      <p className="self-end font-thunder text-[clamp(30px,5.614vw,130px)] font-medium leading-[0.8] text-[var(--fg)]">
        S&amp;C
      </p>
    </section>
  );
}
