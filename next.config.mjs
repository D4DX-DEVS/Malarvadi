/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  // A build and `next dev` share .next and trip over each other, which can take
  // the dev server down. Set NEXT_DIST_DIR to build somewhere else instead.
  distDir: process.env.NEXT_DIST_DIR || ".next"
};
export default nextConfig;
