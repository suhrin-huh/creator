import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL("https://images.unsplash.com/**")],
  },
  /*body 제한 1MB(default) -> 5MB로 변경 */
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // 제한을 5MB로 상향 (기본값: 1MB)
    },
  },
};

export default nextConfig;
