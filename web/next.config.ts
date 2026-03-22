import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@librato/shared'],
  experimental: {
    // Required for using server components with the shared package
    serverExternalPackages: [],
  },
};

export default nextConfig;
