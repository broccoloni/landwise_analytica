/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },

  basePath: '/landwise_analytica',
  assetPrefix: '/landwise_analytica',
};
/** **/
export default nextConfig;
