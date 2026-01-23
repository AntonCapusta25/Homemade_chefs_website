import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vfkmcamplptlkgurnnzi.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.prod.website-files.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // ============================================
      // SEO MIGRATION: Old Webflow Site → New Next.js Site
      // These redirects preserve SEO value and prevent 404 errors
      // ============================================

      // Main page redirects
      {
        source: '/blog-page',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/learning-page-2',
        destination: '/learning',
        permanent: true,
      },
      {
        source: '/nl/home',
        destination: '/nl',
        permanent: true,
      },
      {
        source: '/nl/learning-page',
        destination: '/nl/learning',
        permanent: true,
      },
      {
        source: '/nl/blog-page-nl',
        destination: '/nl/blog',
        permanent: true,
      },
      {
        source: '/untitled',
        destination: '/',
        permanent: true,
      },

      // Blog posts (English): /post/{slug} → /blog/{slug}
      {
        source: '/post/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },

      // Blog posts (Dutch): /blog-posts-dutch/{slug} → /nl/blog/{slug}
      // Handle posts with "-dutch" suffix
      {
        source: '/blog-posts-dutch/:slug(.*)-dutch',
        destination: '/nl/blog/:slug',
        permanent: true,
      },
      // Fallback for Dutch posts without "-dutch" suffix
      {
        source: '/blog-posts-dutch/:slug',
        destination: '/nl/blog/:slug',
        permanent: true,
      },

      // Learning posts (English): /learning-posts/{slug} → /learning/{slug}
      {
        source: '/learning-posts/:slug',
        destination: '/learning/:slug',
        permanent: true,
      },

      // Learning posts (Dutch): /nl/leerposten/{slug} → /nl/learning/{slug}
      {
        source: '/nl/leerposten/:slug',
        destination: '/nl/learning/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
