/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@thock/ui', '@thock/tokens', '@thock/content', '@thock/data'],
}

export default nextConfig
