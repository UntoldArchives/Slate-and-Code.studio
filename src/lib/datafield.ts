/* ---------------------------------------------------------------------------
   The degraded text field behind the #method display words.

   Takes the section's real copy and runs it through a small corruption
   pass — dropped letters, doubled letters, swapped pairs, nonsense tokens,
   ragged spacing, forced breaks — so at texture size the ground reads as
   almost-language rather than as paragraphs.

   Everything is drawn from a seeded PRNG (mulberry32) and generated once at
   module load, so the server and every client produce the exact same
   strings: no hydration mismatch, no reflow between loads. Math.random()
   must never appear in here.
--------------------------------------------------------------------------- */

export type FieldBlock = {
  /* left indent of the paragraph, in ch (0–3) */
  indent: number;
  /* pre-wrap text: carries runs of spaces and forced line breaks */
  text: string;
};

type Rnd = () => number;

function mulberry32(seed: number): Rnd {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rnd: Rnd): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* one word through the die roll:
   ~30% intact / ~25% drop an interior letter / ~20% double a letter /
   ~15% swap two adjacent / ~10% replace with a nonsense token */
function degrade(word: string, rnd: Rnd): string {
  const roll = rnd();
  if (roll < 0.3 || word.length < 3) return word;
  if (roll < 0.55) {
    const i = 1 + Math.floor(rnd() * (word.length - 2));
    return word.slice(0, i) + word.slice(i + 1);
  }
  if (roll < 0.75) {
    const i = Math.floor(rnd() * word.length);
    return word.slice(0, i + 1) + word[i] + word.slice(i + 1);
  }
  if (roll < 0.9) {
    const i = Math.floor(rnd() * (word.length - 1));
    return word.slice(0, i) + word[i + 1] + word[i] + word.slice(i + 2);
  }
  /* 4–9 char nonsense token, drawn from the word's own letter pool */
  const len = 4 + Math.floor(rnd() * 6);
  let out = "";
  for (let i = 0; i < len; i++) out += word[Math.floor(rnd() * word.length)];
  return out;
}

export function generateField(
  source: string[],
  seed: number,
  columns = 5,
  blocksPerColumn = 26
): FieldBlock[][] {
  const rnd = mulberry32(seed);

  /* the word stream: the real copy, repeated and reshuffled until there is
     more than enough to overfill every column */
  const words: string[] = [];
  const need = columns * blocksPerColumn * 45;
  while (words.length < need) {
    for (const p of shuffle([...source], rnd)) words.push(...p.split(" "));
  }

  let at = 0;
  const block = (): FieldBlock => {
    /* 24–42 words comes out around 4–7 set lines at the field's measure */
    const count = 24 + Math.floor(rnd() * 19);
    let text = "";
    for (let i = 0; i < count; i++) {
      text += degrade(words[at++ % words.length], rnd);
      if (i === count - 1) break;
      const b = rnd();
      /* ~8% of boundaries open into a run of 2–8 spaces, ~5% break the
         line mid-paragraph, the rest are ordinary single spaces */
      if (b < 0.08) text += " ".repeat(2 + Math.floor(rnd() * 7));
      else if (b < 0.13) text += "\n";
      else text += " ";
    }
    return { indent: rnd() * 3, text };
  };

  return Array.from({ length: columns }, () =>
    Array.from({ length: blocksPerColumn }, block)
  );
}
