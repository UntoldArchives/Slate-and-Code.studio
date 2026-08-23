"use client";

import { FAQ } from "@/lib/services";
import { LINKS, MAILTO } from "@/lib/links";
import { MaskReveal } from "./reveal";

/*
  Answers stay on the page rather than hiding behind an accordion, the same
  call made for the process descriptions on the home page.
*/
export default function Faq() {
  return (
    <section id="faq" className="gut py-[clamp(70px,9vw,190px)]">
      <MaskReveal inView amount={0.4} className="text-center">
        <h2
          className="display whitespace-nowrap text-[var(--fg)]"
          style={{ fontSize: "clamp(30px, 7vw, 175px)" }}
        >
          Common <span className="text-accent">Questions</span>
        </h2>
      </MaskReveal>

      <div className="mt-[clamp(46px,6vw,140px)] border-b border-[var(--rule)]">
        {FAQ.map(({ q, a }) => (
          <div
            key={q}
            className="grid grid-cols-1 gap-[clamp(10px,1.4vw,34px)] border-t border-[var(--rule)] py-[clamp(24px,2.8vw,58px)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]"
          >
            <h3 className="max-w-[28ch] text-[length:clamp(17px,1.5vw,30px)] font-medium leading-[1.15] tracking-[-0.02em] text-[var(--fg)]">
              {q}
            </h3>
            <p className="max-w-[56ch] text-[length:var(--fs-body)] leading-[1.45] text-[var(--fg-70)]">
              {a}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-[clamp(34px,4vw,90px)] flex flex-wrap items-baseline gap-x-[clamp(18px,2vw,44px)] gap-y-[0.8em]">
        <p className="text-[length:var(--fs-lead)] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--fg)]">
          Not sure which package fits?
        </p>
        <a
          href={MAILTO}
          className="group relative text-[length:var(--fs-lead)] font-medium leading-[1.2] tracking-[-0.02em] text-accent"
        >
          Send a message
          <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
        </a>
        <a
          href={LINKS.instagram}
          target="_blank"
          rel="noreferrer"
          className="micro text-[var(--fg-45)] transition-colors duration-300 hover:text-accent"
        >
          Or on Instagram
        </a>
      </div>
    </section>
  );
}
