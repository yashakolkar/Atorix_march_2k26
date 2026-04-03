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

  experimental: {
    // serverActions: true,
    optimizePackageImports: ["framer-motion"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    // next.config.js
    module.exports = {
      images: {
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      },
    };

    // Split chunks for better caching
    config.optimization.splitChunks = {
      chunks: "all",
      maxInitialRequests: 10,
      minSize: 0,
      cacheGroups: {
        vendor: {
          name: "vendor",
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          priority: 10,
          enforce: true,
        },
      },
    };

    return config;
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
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
      // From integrated file - Allow all domains
      {
        protocol: "https",
        hostname: "**", // Allow all domains
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Adjust any experimental features as needed
    serverActions: true, // From integrated file
  },
  // API proxy configuration (from integrated file)
};

module.exports = {
  // Drop IE11 polyfills
  browsersListForSwc: true,
  // OR set in package.json:
};
// Set port for development (from integrated file)
if (process.env.NODE_ENV === "development") {
  process.env.PORT = "3000";
  process.env.HOST = "0.0.0.0";
}
module.exports = {
  swcMinify: true,
  compiler: {
    removeConsole: true,
  },
};

module.exports = nextConfig;
