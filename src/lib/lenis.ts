import type Lenis from "lenis";

/* Module-level handle so any component can drive smooth scrolling. */

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}

export function scrollToTarget(target: string | number) {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.6 });
  } else if (typeof target === "string") {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  } else {
    window.scrollTo({ top: target, behavior: "smooth" });
  }
}
