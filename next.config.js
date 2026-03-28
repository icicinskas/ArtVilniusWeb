const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./lib/i18n.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // next-intl naudoja @formatjs - transpiliuojame, kad išvengtume vendor-chunks klaidų
  transpilePackages: ['next-intl'],
  experimental: {
    // Server komponentai naudoja šiuos paketus - laikome juos išoriniais
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = withNextIntl(nextConfig)
