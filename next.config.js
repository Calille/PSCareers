/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed `output: 'export'` in favour of Vercel deployment.
  // If we need to switch back to cPanel static export, re-enable:
  //   output: 'export',
  //   images: { unoptimized: true },
  //   trailingSlash: true,
  reactStrictMode: true,
};

module.exports = nextConfig;
