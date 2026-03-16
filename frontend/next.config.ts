import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    position: "bottom-right"

  },
  experimental: {

  },
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
