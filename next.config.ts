import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "yyqkemabxechuzdfnwno.supabase.co",
        pathname: "/storage/v1/object/public/**", // 특정 경로만 허용 (보안상 권장)
      },
    ],
  },
  /*body 제한 1MB(default) -> 5MB로 변경 */
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb", // 제한을 5MB로 상향 (기본값: 1MB)
    },
  },
};

export default nextConfig;
