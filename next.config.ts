import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    // Fotos de productos cargadas en Sanity
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" }],
  },
  // El configurador por pasos se reemplazó por /personalizar
  async redirects() {
    return [
      { source: "/configurador", destination: "/personalizar", permanent: true },
      { source: "/configurador/:terrain(tierra|arena)", destination: "/personalizar", permanent: true },
    ];
  },
};

export default nextConfig;
