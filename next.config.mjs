import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Emit a fully static site into `out/` (`next build` → static HTML/CSS/JS)
  // instead of requiring a `next start` Node server. The content is all SSG,
  // so this drops the deployed footprint from a ~150–250 MB Node/Next runtime
  // to a static file server (~tens of MB) with byte-identical output. Search
  // is served as a prebuilt static index (see app/api/search/route.ts).
  output: 'export',
  // Static export can't run the on-demand image optimizer; the site uses no
  // next/image, so this is a no-op guard that keeps `export` from erroring.
  images: { unoptimized: true },
};

export default withMDX(config);
