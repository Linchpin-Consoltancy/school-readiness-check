import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The report route reads font files from disk at runtime, so they have to
  // be bundled with it when the site is deployed.
  outputFileTracingIncludes: {
    "/api/report": ["./src/assets/fonts/**"],
  },

  // Lets a phone or tablet on the same wifi reach the development server.
  // Development only. This has no effect on the deployed site.
  allowedDevOrigins: [
    "192.168.100.2",
    "192.168.0.*",
    "192.168.1.*",
    "192.168.100.*",
    "10.0.0.*",
  ],
};

export default nextConfig;
