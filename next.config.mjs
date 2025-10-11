/** @type {import('next').NextConfig} */
import withPWA from "@ducanh2912/next-pwa";

// Vercel Database Setup
const setupDatabase = () => {
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL) {
    try {
      const { execSync } = require('child_process');
      console.log('🔄 Setting up database for Vercel deployment...');
      execSync('npx prisma db push', {
        stdio: 'inherit',
        env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL }
      });
      console.log('✅ Database setup completed');
    } catch (error) {
      console.error('❌ Database setup failed:', error);
      // Don't fail the build, just log the error
    }
  }
};

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
  // Vercel database setup during build
  generateBuildId: async () => {
    setupDatabase();
    return 'build-id-' + Date.now();
  },
  experimental: {
    // Handle missing chunks gracefully
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
    
    // Add better error handling for development
    if (dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      };
    }
    
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
  // Add better error handling
  async rewrites() {
    return [];
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      }
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
});

export default nextConfig;