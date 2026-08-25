/* ---------------------------------------------------------------------------
   Services content, lifted from the live slateandcode.studio services page.

   Short-form editing and the monthly reels system were dropped in Aug 2026 —
   the studio no longer sells them. Four services remain and they read as a
   ladder: presence, then a full site, then a custom tool, then all of it
   built together. The layout in Packages.tsx leans on that order.

   Prices are split into lead / figure / tail so the figure can be set in
   Thunder at display size while "From" and "to $7,000+" stay small. A scope
   line under the figure carries page and module counts, so a larger brief can
   see itself in a tier instead of anchoring on the starting number.

   Two FAQ answers were behind a collapsed accordion on the live page and
   could not be read off it; they are marked DRAFT below and should be
   confirmed before this goes live, since they are commercial commitments.
--------------------------------------------------------------------------- */

export type Package = {
  name: string;
  /* small word before the figure — "From" */
  priceLead?: string;
  /* the figure itself, set large in Thunder */
  price: string;
  /* small qualifier after the figure — "to $7,000+", "per month" */
  priceTail?: string;
  /* the size of the thing being bought — "5 to 12 pages", "3 to 8 modules".
     Sits under the price so the figure reads as a rate for a known scope
     rather than a floor with nothing attached to it. */
  scope?: string;
  summary: string;
  includes: string[];
  /* one of these two, depending on what the source page carried */
  bestFor?: string;
  note?: string;
  /* spans the full row on desktop — used for the combined package, which
     sits under the three services it is made of */
  wide?: boolean;
};

export const PACKAGES: Package[] = [
  {
    name: "Web Presence",
    priceLead: "From",
    price: "$1,500",
    scope: "1 to 3 pages",
    summary:
      "Landing pages, business websites, and redesigns for brands that need a sharper online presence.",
    includes: [
      "1 to 3 pages, designed page by page",
      "Responsive across phone, tablet, desktop",
      "Frontend build",
      "Contact / inquiry CTA",
      "Basic SEO structure",
      "2 rounds of revisions",
      "Launch support",
    ],
    bestFor:
      "Small businesses, service brands, and companies that need a clean digital first impression.",
  },
  {
    name: "Business Website",
    priceLead: "From",
    price: "$2,500",
    scope: "5 to 12 pages",
    summary:
      "Multi-page websites and full-stack web experiences with stronger structure, forms, integrations, and dynamic functionality where needed.",
    includes: [
      "5 to 12 pages, plus reusable page templates",
      "Custom design for every page type",
      "Frontend development",
      "Forms, booking, and third-party integrations",
      "Backend or CMS where needed, so you can edit content yourself",
      "Blog, case studies, or catalogue where needed",
      "Responsive testing",
      "3 rounds of revisions",
      "Launch support",
    ],
    bestFor: "Businesses that need more than a basic landing page.",
  },
  {
    name: "Custom Business Tool",
    price: "$4,000",
    priceTail: "to $7,000+",
    scope: "3 to 8 modules",
    summary:
      "Custom internal tools built around the way your business actually works.",
    includes: [
      "Dashboards",
      "Report systems",
      "CRMs",
      "Stock trackers",
      "Admin panels",
      "Workflow tools",
      "User roles and permissions",
      "PDF / report generation where needed",
      "Migration of your existing spreadsheets and records",
      "Handover walkthrough for your team",
    ],
    bestFor:
      "Businesses that are tired of messy spreadsheets, manual reports, and scattered workflows.",
  },
  {
    name: "Complete Digital System",
    price: "Custom quote",
    scope: "Site and tool, built together",
    summary:
      "A combined package for businesses that need the website and the internal tool behind it built together, as one system rather than two projects.",
    includes: [
      "Website or redesign",
      "Custom dashboard or internal tool",
      "Brand-consistent digital direction",
      "One design system across both",
      "Multi-phase build with a fixed schedule",
      "Launch support",
    ],
    bestFor:
      "Businesses that want one consistent digital system instead of scattered freelancers.",
    wide: true,
  },
];

export const PRICING_NOTES = [
  "Prices are starting points for the scope listed on each card. Larger builds are quoted on the same basis: more pages, more modules, deeper integrations, more content to produce, or a compressed timeline all move the figure up.",
  "Projects include a clear revision structure. Major scope changes or new feature requests are quoted separately.",
];

export const FAQ: { q: string; a: string; draft?: boolean }[] = [
  {
    q: "How long does a website take?",
    a: "A landing page usually takes 1 to 2 weeks. Full business websites take 2 to 4 weeks depending on pages, features, and how ready your content is.",
  },
  {
    q: "What do you need from me to get started?",
    a: "Once the proposal is signed you get a starter pack: the schedule, the checklists, and a short list of everything I need from you. Usually that is your copy, logo and brand files, any photography or footage, and access to your domain.",
  },
  {
    q: "How do payments work?",
    /* DRAFT — not readable on the live page. Confirm before publishing. */
    a: "Projects are split across a deposit to book the work in and a balance on delivery, both invoiced in writing.",
    draft: true,
  },
  {
    q: "Do you handle domains and hosting?",
    /* DRAFT — not readable on the live page. Confirm before publishing. */
    a: "Yes. I can register and set up a domain and get hosting running for you, or deploy onto a domain and host you already own. You keep ownership of both either way.",
    draft: true,
  },
  {
    q: "Can you work with an existing website?",
    a: "Yes. Redesigns are part of the Web Presence package, and existing sites can be rebuilt page by page or extended with new sections and tools rather than started over.",
  },
  {
    q: "What moves the price above the starting figure?",
    a: "Page and module count first, then everything attached to them: custom design work per page type, integrations with tools you already run, user roles and permissions, content and photography that has to be produced rather than supplied, and how fast you need it live. A ten page site with a booking system and a client portal is a different build to a three page site, and it is quoted as one.",
  },
  {
    q: "What if I am not sure which package I need?",
    a: "Send a message and I will point you to the right one. If nothing fits cleanly, the scope gets quoted on its own.",
  },
];
