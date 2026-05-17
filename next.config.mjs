/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  webpack: (config) => {
    // Required for pdfjs-dist — disables the optional native canvas module
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
};

export default nextConfig;
