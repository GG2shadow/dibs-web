/* eslint-disable @typescript-eslint/no-require-imports */
// next.config.js

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: true,
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    domains: ['images.unsplash.com', 'xgidujoanslsfwwtqidj.supabase.co'],
  },
};

module.exports = withMDX(nextConfig);
