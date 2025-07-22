/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Disable static optimization for pages that use searchParams
    forceSwcTransforms: true,
  },
  // Ensure proper handling of client components
  transpilePackages: [],
};

export default nextConfig;
