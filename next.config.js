/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['assets.whop.com', 'cdn.discordapp.com']
  }
}

module.exports = nextConfig
