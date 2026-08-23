/* The one text-link treatment on the site: a micro label at 70% ink that
   comes up to full ink on hover while an accent rule wipes in from the left
   underneath. Shared by the navbar items and the project names in the work
   strip, so a link reads the same wherever it sits. */

export const TEXT_LINK =
  "group relative micro text-[var(--fg-70)] transition-colors duration-300 hover:text-[var(--fg)]";

export const TEXT_LINK_RULE =
  "absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100";
