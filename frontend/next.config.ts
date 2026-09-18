import type { NextConfig } from "next";

// The Express API runs as its own process, but the browser never talks to it
// directly: everything the admin panel calls goes through this origin at
// /api/v1/* and Next proxies it. One port for the whole site, and the session
// cookie stays same-origin.
const API_ORIGIN = process.env.API_ORIGIN ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [{ source: "/api/v1/:path*", destination: `${API_ORIGIN}/api/v1/:path*` }];
  },
  // CDN host will be allowlisted here in a later phase (no prod config yet).
  // images: { remotePatterns: [] },
};

export default nextConfig;
