import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@librato/shared'],
  serverExternalPackages: ['@anthropic-ai/sdk'],
};

export default nextConfig;
