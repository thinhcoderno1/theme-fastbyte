function remotePatternFromUrl(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable ${name}. Copy .env.example to .env.local.`);
  }
  const url = new URL(value);
  return {
    protocol: url.protocol.replace(':', ''),
    hostname: url.hostname,
    port: url.port,
    pathname: '/**',
  };
}

function validateUrl(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable ${name}. Copy .env.example to .env.local.`);
  }
  new URL(value);
}

validateUrl('WORDPRESS_API_URL');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emit the minimal Node.js server used by the production Docker image.
  output: 'standalone',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      remotePatternFromUrl('NEXT_PUBLIC_SITE_URL'),
      remotePatternFromUrl('NEXT_PUBLIC_ASSET_BASE_URL'),
      remotePatternFromUrl('WORDPRESS_SITE_URL'),
      {
        protocol: 'https',
        hostname: 'id.thuevpsgiare.vn',
      },
      {
        protocol: 'https',
        hostname: 'online.gov.vn',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
      },
    ],
  },
};

export default nextConfig;
