/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    unoptimized: true, // For better compatibility on Render
  },
  // No environment variables required - all config has safe defaults
  swcMinify: true,
  reactStrictMode: true,
}

module.exports = nextConfig
