/* The one place the public origin and the share card live. Metadata on every
   route builds off these so the og:image URL resolves absolutely.

   www, not the apex: the apex 308s to www, so canonical links and the og:image
   URL are written at the origin that actually answers. */

export const SITE_URL = "https://www.slateandcode.studio";
export const SITE_NAME = "Slate & Code Studio";

export const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Slate & Code Studio. Websites, software, systems. A studio of one, by design.",
};
