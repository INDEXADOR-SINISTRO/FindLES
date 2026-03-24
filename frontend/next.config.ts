import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    position: "bottom-right"

  },
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true, // Use 'false' se for um redirecionamento temporário
      },
    ];
  },
};

export default nextConfig;
