/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  basePath: '/landwise_analytica/landwise-dashboard',
  assetPrefix: '/landwise_analytica/landwise-dashboard',
};

export default nextConfig;
