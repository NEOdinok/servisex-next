/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ["s3-s1.retailcrm.tech"],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default nextConfig;
