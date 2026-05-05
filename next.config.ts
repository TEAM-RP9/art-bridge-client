/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: process.env.NODE_ENV !== 'production',
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  async rewrites() {
    const backend = process.env.BACKEND_API_URL ?? 'http://localhost:8080';
    return [{ source: '/api/:path*', destination: `${backend}/:path*` }];
  },
};

module.exports = nextConfig;
