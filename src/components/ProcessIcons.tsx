/* ---------------------------------------------------------------------------
   Line icons for the four process steps. Drawn on a 24 unit grid and stroked
   with `non-scaling-stroke`, so the line stays the same weight whatever size
   the icon is rendered at instead of fattening up with it.

   They inherit currentColor, which means they invert with the rest of the
   page rather than needing their own colour.
--------------------------------------------------------------------------- */

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  vectorEffect: "non-scaling-stroke" as const,
  "aria-hidden": true,
};

/* 01 — a call: the handset */
export function IconCall({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path
        vectorEffect="non-scaling-stroke"
        d="M21.5 16.9v2.6a2 2 0 0 1-2.2 2 19.6 19.6 0 0 1-8.5-3 19.3 19.3 0 0 1-6-6 19.6 19.6 0 0 1-3-8.6A2 2 0 0 1 3.8 1.7h2.6a2 2 0 0 1 2 1.7 12.7 12.7 0 0 0 .7 2.8 2 2 0 0 1-.5 2.1L7.5 9.5a15.9 15.9 0 0 0 6 6l1.2-1.1a2 2 0 0 1 2.1-.5 12.7 12.7 0 0 0 2.8.7 2 2 0 0 1 1.7 2Z"
      />
      <path vectorEffect="non-scaling-stroke" d="M14.8 3.2a6.5 6.5 0 0 1 5 5" />
    </svg>
  );
}

/* 02 — the agreement: a page, signed */
export function IconAgreement({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path
        vectorEffect="non-scaling-stroke"
        d="M14 2.2H6.8a2 2 0 0 0-2 2v15.6a2 2 0 0 0 2 2h10.4a2 2 0 0 0 2-2V7.4Z"
      />
      <path vectorEffect="non-scaling-stroke" d="M14 2.2v4.2a1 1 0 0 0 1 1h4.2" />
      <path vectorEffect="non-scaling-stroke" d="M8.2 12.4h5.4" />
      <path
        vectorEffect="non-scaling-stroke"
        d="M8.2 16.6c1-1.3 1.8.9 2.9-.2s1.6 1 3.2-.3"
      />
    </svg>
  );
}

/* 03 — the starter pack: a boxed-up handover */
export function IconPack({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path
        vectorEffect="non-scaling-stroke"
        d="M3.4 8.8h17.2v10.6a2 2 0 0 1-2 2H5.4a2 2 0 0 1-2-2Z"
      />
      <path
        vectorEffect="non-scaling-stroke"
        d="M2.2 4.2h19.6a.8.8 0 0 1 .8.8v3a.8.8 0 0 1-.8.8H2.2a.8.8 0 0 1-.8-.8V5a.8.8 0 0 1 .8-.8Z"
      />
      <path vectorEffect="non-scaling-stroke" d="M12 4.2v17.2" />
    </svg>
  );
}

/* 04 — delivered: the thing itself, signed off */
export function IconShipped({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path
        vectorEffect="non-scaling-stroke"
        d="M4 3.4h16a2 2 0 0 1 2 2v13.2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5.4a2 2 0 0 1 2-2Z"
      />
      <path vectorEffect="non-scaling-stroke" d="M2 8.6h20" />
      <path vectorEffect="non-scaling-stroke" d="M5.1 6h.01M7.7 6h.01M10.3 6h.01" />
      <path vectorEffect="non-scaling-stroke" d="m8.8 14.6 2.3 2.3 4.4-4.7" />
    </svg>
  );
}
