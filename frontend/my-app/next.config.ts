import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: 'https://mybooklongbackend.gentlebeach-ec9f59b6.eastus.azurecontainerapps.io/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '<https://app.example>' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

export default nextConfig;
