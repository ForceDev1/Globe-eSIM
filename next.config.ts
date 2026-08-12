import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The on-screen dev route indicator sits bottom-left and overlaps the
  // app's own bottom nav on a phone-sized viewport — hide it.
  devIndicators: false,
};

export default nextConfig;
