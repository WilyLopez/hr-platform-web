/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Required for Docker multi-stage build (copies only what's needed to run)
  output: "standalone",
  images: {
    domains: [
      "localhost",
      "127.0.0.1",
      "hr-platform-api.onrender.com",
    ],
  },
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;