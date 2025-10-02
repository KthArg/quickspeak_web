const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {

  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname),
  
  images: {
    unoptimized: false,

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/9.x/avataaars/svg',
      },
      {
        protocol: 'https',
        hostname: 'unpkg.com',
        port: '',
        pathname: '/circle-flags/flags/**',
      },
    ],
  },
};

module.exports = nextConfig;