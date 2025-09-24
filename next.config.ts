/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...puedes tener otras configuraciones aquí
  
  images: {
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