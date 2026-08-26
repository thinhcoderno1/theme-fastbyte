/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'thuevpsgiare.vn',
      },
      {
        protocol: 'https',
        hostname: 'id.thuevpsgiare.vn',
      },
      {
        protocol: 'https',
        hostname: 'online.gov.vn',
      },
    ],
  },
};

export default nextConfig;
