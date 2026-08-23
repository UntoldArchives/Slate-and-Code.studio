/* ---------------------------------------------------------------------------
   Thunder set-width table.

   Each number is the sum of the advance widths of that string in
   Thunder Bold LC, expressed in em (measured from the shipped woff2,
   unitsPerEm 1000). LC is the low-contrast cut. Do not swap in the HC
   files: that is the high-contrast cut, whose horizontal strokes are
   hairlines by design and vanish at display sizes.

   Dividing the available width by the number gives the font-size at which
   the line spans its container exactly, at any viewport, with no measuring
   in the browser and no layout shift.

   If you change a headline, remeasure it rather than eyeballing the size.
--------------------------------------------------------------------------- */
export const SET_WIDTH = {
  wordmark: 4.105, // SLATE & CODE’
  process: 7.337, //   HOW THE PROCESS FLOWS
  about: 5.38, //    ABOUT THE STUDIO
  work: 4.526, //     SELECTED WORK
} as const;

/* font-size that makes a line of `em` set-width fill the page gutters. */
export function fitToGutters(em: number) {
  return `calc((100vw - var(--gutter) * 2) / ${em})`;
}
