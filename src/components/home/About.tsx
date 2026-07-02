import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import SpotlightCard from "@/components/SpotlightCard";

/** Compact studio facts: value first, micro label as the annotation. */
const FACTS = [
  { label: "Disciplines", value: "Design · Develop · Direct" },
  { label: "Reach", value: "Brands worldwide" },
  { label: "Contact", value: "One person, start to finish" },
];

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 border-t border-line bg-pit">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* Narrative */}
          <div>
            <SectionHeading
              eyebrow="About the Studio"
              title={
                <>
                  Design, develop, and direct, from{" "}
                  <em className="serif-accent">one pair of hands</em>.
                </>
              }
            />

            <Reveal delay={0.1}>
              <div className="mt-7 space-y-5 text-[15px] leading-relaxed text-fog">
                <p>
                  Slate &amp; Code Studio is a studio of one, by design. The
                  same person who designs the screen writes the code behind it
                  and directs the content that fills it. There is no handoff where the
                  idea gets watered down, no three freelancers pointing at each
                  other, and no detail left to fall between the cracks.
                </p>
                <p>
                  I care, in equal measure, about how a thing looks, how it is
                  built, and how it makes someone feel. A website should load
                  fast and convert, and it should still have taste. A tool
                  should be genuinely useful, and it should be a pleasure to
                  open. That standard is the studio.
                </p>
              </div>
            </Reveal>

            {/* Signature */}
            <Reveal delay={0.18}>
              <div className="mt-9 flex items-center gap-4">
                <span className="h-px w-10 bg-gold/60" />
                <span className="font-serif text-2xl italic text-ivory/90">
                  Slate &amp; Code
                </span>
              </div>
            </Reveal>
          </div>

          {/* Studio card */}
          <Reveal delay={0.12}>
            <SpotlightCard color="gold" className="h-full rounded-lg">
              <div className="relative flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface p-8">
                {/* The brand mark as the card's graphic: an oversized serif
                    ampersand bleeding off the corner, seated in a gold bloom */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-14 h-56 w-56 rounded-full bg-gold/[0.07] blur-[70px]"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-6 -top-24 select-none font-serif text-[15rem] italic leading-none text-gold/[0.08]"
                >
                  &amp;
                </span>

                <div className="relative flex items-center gap-3">
                  <span className="block h-2 w-2 rotate-45 bg-gold" />
                  <span className="font-display text-sm font-semibold tracking-[0.18em] text-ivory">
                    SLATE <span className="text-gold">&amp;</span> CODE
                    <span className="ml-2 text-[10px] font-medium tracking-[0.3em] text-fog">
                      STUDIO
                    </span>
                  </span>
                </div>

                <p className="relative mb-10 mt-8 max-w-[21ch] font-serif text-[1.7rem] italic leading-[1.3] text-ivory/90">
                  Designed, developed, and directed{" "}
                  <span className="whitespace-nowrap text-gold">by hand</span>.
                </p>

                {/* Meta rows read value first; the label annotates from the
                    right edge like a drafting note */}
                <dl className="relative mt-auto space-y-4 border-t border-line pt-6">
                  {FACTS.map((f) => (
                    <div key={f.label} className="flex items-center gap-3">
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 shrink-0 rotate-45 bg-gold/70"
                      />
                      {/* Labels annotate from sm: up; phones keep them for
                          screen readers but the values speak for themselves */}
                      <dt className="micro order-last ml-auto shrink-0 text-fog/80 max-sm:sr-only">
                        {f.label}
                      </dt>
                      <dd className="text-[13px] leading-relaxed text-ivory/85">
                        {f.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="relative mt-6 flex items-center justify-between gap-6 border-t border-line pt-5">
                  <span className="micro text-fog">Availability</span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/[0.07] px-3 py-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold motion-reduce:animate-none" />
                    <span className="text-[11px] font-semibold tracking-wide text-gold">
                      Open for projects
                    </span>
                  </span>
                </div>
              </div>
            </SpotlightCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
