
/** @type {import('next').NextConfig} */
import withPWA from "@ducanh2912/next-pwa";

const nextConfig = withPWA({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === "development",
  // Fix POST request caching issue
  runtimeCaching: [
    {
      urlPattern: ({ request }) => request.method === 'POST',
      handler: 'NetworkOnly',
      options: {
        cacheName: 'post-requests',
        networkTimeoutSeconds: 10,
      },
    },
    // Handle source map requests
    {
      urlPattern: /.*\.map$/,
      handler: 'NetworkOnly',
      options: {
        cacheName: 'source-maps',
        networkTimeoutSeconds: 5,
      },
    },
  ],
  // Handle missing files gracefully
  additionalManifestEntries: [],
  // Exclude problematic files from precaching
  buildExcludes: [
    /.*\.map$/,
    /buildManifest\.js$/,
    /_ssgManifest\.js$/,
  ],
})({
  // your next.js config
  experimental: {
    // Handle missing chunks gracefully
    missingSuspenseWithCSRBailout: false,
  },
  // Add proper error handling
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Reduce source map noise in development
  productionBrowserSourceMaps: false,
  // Configure webpack to handle source maps better
  webpack: (config, { dev, isServer }) => {
    // Let Next.js handle devtool automatically for better performance
    // Removed custom devtool override to prevent warning
    return config;
  },
  // Add headers for better development experience
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
});

export default nextConfig;
