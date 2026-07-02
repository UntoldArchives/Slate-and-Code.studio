"use client";

import { useEffect } from "react";
import { SITE } from "@/lib/site";

/* Module-level flag: strict mode double-invokes effects and client
   navigations remount layouts, but the signature must print exactly once. */
let signed = false;

/** One-time styled console signature for anyone who opens devtools. */
export default function ConsoleSignature() {
  useEffect(() => {
    if (signed) return;
    signed = true;

    // Palette hexes are inlined because the console cannot read CSS vars.
    console.log(
      "%cSLATE & CODE %cSTUDIO",
      "color:#d6a85a;background:#0b0b0b;font-weight:600;font-size:14px;letter-spacing:0.24em;padding:10px 2px 10px 14px;",
      "color:#f4f1ea;background:#0b0b0b;font-weight:600;font-size:14px;letter-spacing:0.24em;padding:10px 14px 10px 2px;"
    );
    console.log(
      `%cDesigned, developed, and directed by hand.\n%cInstagram · ${SITE.instagramHandle} · ${SITE.instagramUrl}\nEmail · ${SITE.email}`,
      "color:#f4f1ea;font-size:12px;line-height:1.9;",
      "color:#8a8a8a;font-size:12px;line-height:1.9;"
    );
  }, []);

  return null;
}
