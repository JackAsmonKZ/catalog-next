import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/catalog",
        permanent: true, // 308 redirect (или false для 307)
      },
    ];
  },
  reactCompiler: true,
  images: {
    remotePatterns: [new URL("https://picsum.photos/**")],
  },
};

export default nextConfig;
