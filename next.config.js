/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xnetjsifkhtbbpadwlxy.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async rewrites() {
    return [
      // Only keep API gateway routes for backend communication
      {
        source: '/api/auth/:path*',
        destination: 'http://localhost:6800/api/auth/:path*',
      },
      {
        source: '/api/outpatient/:path*',
        destination: 'http://localhost:6830/api/:path*',
      },
      {
        source: '/api/inpatient/:path*',
        destination: 'http://localhost:6831/api/:path*',
      },
      {
        source: '/api/diagnostics/:path*',
        destination: 'http://localhost:6832/api/:path*',
      },
      {
        source: '/api/operation-theater/:path*',
        destination: 'http://localhost:6833/api/:path*',
      },
      {
        source: '/api/pharmacy/:path*',
        destination: 'http://localhost:6834/api/:path*',
      },
      {
        source: '/api/finance/:path*',
        destination: 'http://localhost:6850/api/:path*',
      },
      {
        source: '/api/hr/:path*',
        destination: 'http://localhost:6860/api/:path*',
      },
      {
        source: '/api/rostering/:path*',
        destination: 'http://localhost:6840/api/:path*',
      },
      {
        source: '/api/purchasing/:path*',
        destination: 'http://localhost:6870/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig