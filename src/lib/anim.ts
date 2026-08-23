/* Shared motion constants, pulled from the Figma prototype exports. */

/* Navbar / hero entrance — the "slow-fast-slow" house ease */
export const EASE_HOUSE = [0.335, 0.009, 0, 0.994] as const;

/* Footer slice reveal ease */
export const EASE_SLICE = [0.299, -0.009, 0, 0.989] as const;

/* Short, confident ease for hovers and small state changes */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const cubic = (e: readonly number[]) =>
  `cubic-bezier(${e[0]}, ${e[1]}, ${e[2]}, ${e[3]})`;

export const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
