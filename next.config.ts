import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  images: {
    formats: ["image/avif", "image/webp"],
    /* the work tiles render at 360 to 920px wide; nothing on the site needs
       the default 3840 ceiling */
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  /* the previous site had a /contact page; contact is a modal now. Anything
     still pointing at the old URL lands on the CTA that opens it. */
  async redirects() {
    return [{ source: "/contact", destination: "/#contact", permanent: true }];
  },
};

export default nextConfig;
