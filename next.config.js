/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: '"lh3.googleusercontent.com"',
      },
      {
        hostname: '"firebasestorage.googleapis.com"',
      },
    ],
  },
};

module.exports = nextConfig;
