import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Next.js 15 ile generateEtags varsayılan olarak true
  generateEtags: process.env.NODE_ENV === 'production',

  // React optimizations for Next.js 15
  reactStrictMode: true,

  // Bundle optimizations
  bundlePagesRouterDependencies: true,

  // Image optimizations - Next.js 15 ile güncellenmiş
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/images/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/uploads/**",
      },
      {
        hostname: "api.crafter.net.tr",
        pathname: "/uploads/**",
      },
      {
        hostname: "minotar.net",
        pathname: "/**",
      },
      {
        hostname: "mc-heads.net",
        pathname: "/**"
      }
    ],
    // Next.js 15'te formats artık desteklenmiyor, loader seviyesinde yapılıyor
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Optimize edilmiş boyutlar
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Next.js 15'te loader konfigürasyonu
    loader: 'default',
    unoptimized: false, // Her zaman optimizasyon kullan
  },

  // Next.js 15 experimental features
  experimental: {
    // CSS optimizasyonu
    optimizeCss: process.env.NODE_ENV === 'production',

    // Package import optimizasyonu
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'react-icons',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      'clsx',
      'tailwind-merge'
    ],

    // React 19 desteği
    reactCompiler: process.env.NODE_ENV === 'production',
  },

  // Turbopack configuration - Next.js 15'te turbo yerine turbopack kullanılıyor
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
    resolveAlias: {
      '@': require('path').resolve(__dirname, './src'),
    },
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer, webpack }) => {
    // Production optimizasyonları
    if (!dev) {
      // Tree shaking
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;

      // Bundle splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
      };
    }

    // Development'ta hızlı refresh için
    if (dev) {
      config.watchOptions = {
        ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**'],
        poll: false,
      };
    }

    // Module resolve optimizasyonu
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };

    // Performance optimizasyonu
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './src'),
    };

    return config;
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
    // React Server Components için
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },

  // Output configuration
  output: 'standalone',

  // URL yapısı
  trailingSlash: false,

  // CDN desteği
  assetPrefix: process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_CDN_URL || ''
    : '',

  // Logging optimizasyonu
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },

  // TypeScript strict mode
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint strict mode
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;