import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // статика: по странице на каждую сущность, без сервера
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
