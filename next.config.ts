import type { NextConfig } from "next";

// Сайт живёт на GitHub Pages в подпапке /artel-masters/ (Vercel из РФ с 2026-10 открывается
// с перебоями). Ссылки next/link и router basePath учитывают сами; пути к файлам из public
// в коде собираются через NEXT_PUBLIC_BASE_PATH.
const basePath = "/artel-masters";

const nextConfig: NextConfig = {
  // статика: по странице на каждую сущность, без сервера
  output: "export",
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
