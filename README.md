# Slate & Code Studio

The studio site — [slateandcode.studio](https://www.slateandcode.studio).
Next.js App Router, React 19, Tailwind v4, Motion, Lenis.

## Run it

```bash
npm install
npm run dev      # http://localhost:7030
npm run build
```

## Routes

Two pages. Contact is a modal, not a route.

- `src/app/page.tsx` — hero, manifesto, work strip, CTA, process, about, footer
- `src/app/services/page.tsx` — services, packages, FAQ
- `src/app/not-found.tsx`, `robots.ts`, `sitemap.ts`

## Where things live

- `src/lib/site.ts` — public origin and the share card. Everything's metadata
  builds off it, so the og:image resolves absolutely.
- `src/lib/links.ts` — every external link, including the inbox address.
- `src/lib/services.ts` — the service tiers, which also fill the contact
  form's budget ranges.
- `src/lib/anim.ts` — the easing curves and durations the whole site shares.
- `src/lib/type.ts`, `src/lib/ui.ts` — the type scale and the repeated class strings.
- `src/app/globals.css` — colour tokens, the fluid type scale, `@font-face`.

## How a few things work

- **Contact** is one modal mounted in the layout. Any button anywhere calls
  `openContact()` from `src/lib/contact.ts`, which fires a window event the
  modal listens for. Submitting composes a prefilled `mailto:` — there is no
  backend and no API key to keep alive.
- **The page inverts** from ink to paper as `#about` takes the viewport;
  `src/components/Invert.tsx` drives it off the scroll position.
- **The work strip** runs on its own; press and hold to skim it faster, with
  the blur tracking the speed. A clean click opens the project's live site,
  a drag doesn't.
- **Reduced motion** is honoured throughout: reveals start resolved, Lenis
  never initialises, and scrolling is native.

## Fonts

Thunder and Neue Montreal, subset to Latin and trimmed to the five weights
actually used. `/public/fonts` holds those subsets; the originals stay out of
the repo. The four faces on screen at first paint are preloaded in the layout.
