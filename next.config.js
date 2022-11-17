/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['assets.whop.com', 'cdn.discordapp.com', 'images.unsplash.com', 'imagedelivery.net']
  }
}

module.exports = nextConfig
