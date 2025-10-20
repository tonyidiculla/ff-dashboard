/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/services/:path*',
        destination: 'http://localhost:6800/api/:path*', // Proxy to auth service
      },
    ]
  },
}

module.exports = nextConfig