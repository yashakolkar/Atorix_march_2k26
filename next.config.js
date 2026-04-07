const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest\.json$/],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // ─── Remove console.log in production ──────────────────────
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // ─── Experimental optimizations ────────────────────────────
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "recharts",
      "@radix-ui/react-icons",
      "@react-three/drei",
      "@react-three/fiber",
      "date-fns",
      "react-hook-form",
    ],
    serverActions: true,
  },

  // ─── Image optimization ────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "ext.same-assets.com",
      "ugc.same-assets.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ext.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ugc.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // ─── Headers for caching ───────────────────────────────────
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // ✅ Cache JS/CSS chunks for 1 year (they have hashed filenames)
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // ─── Webpack optimizations ─────────────────────────────────
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };

      // Better chunk splitting for caching
      config.optimization.splitChunks = {
        chunks: "all",
        maxInitialRequests: 30,
        minSize: 15000,
        maxSize: 200000, // ✅ Break large chunks into ≤200KB pieces
        cacheGroups: {
          // Separate heavy libs into their own chunks
          framework: {
            name: "framework",
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            chunks: "all",
            priority: 40,
            enforce: true,
          },
          framerMotion: {
            name: "framer-motion",
            test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
            chunks: "async", // ✅ Changed to async — only load when needed
            priority: 30,
            enforce: true,
          },
          threeJs: {
            name: "three-js",
            test: /[\\/]node_modules[\\/](@react-three|three)[\\/]/,
            chunks: "async", // ✅ Changed to async — 3D is never needed on first paint
            priority: 30,
            enforce: true,
          },
          recharts: {
            name: "recharts",
            test: /[\\/]node_modules[\\/](recharts|d3-.*)[\\/]/,
            chunks: "async", // ✅ Changed to async
            priority: 30,
            enforce: true,
          },
          // ✅ Separate mongoose/openai (server-only, should not be in client bundle)
          serverOnly: {
            name: "server-only",
            test: /[\\/]node_modules[\\/](mongoose|openai)[\\/]/,
            chunks: "async",
            priority: 35,
            enforce: true,
          },
          vendor: {
            name: "vendor",
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      };
    }

    return config;
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = withPWA(nextConfig);
