import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,
    output: "export",
    basePath: "/biotech-trial-deployment",
    images: {
        unoptimized: true, // GitHub Pages can't run Next.js image optimizer
    },
};

export default nextConfig;
