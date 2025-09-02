import { fileURLToPath } from 'node:url'

import { defineNuxtConfig } from 'nuxt/config'
import glsl from 'vite-plugin-glsl'

import type { InputConfig } from 'c12'
import type { NuxtConfig } from 'nuxt/config'

const siteTitle = ''
const siteDesc = ''
const siteUrl = 'https://example.com'
const imageUrl = '/share.jpg'

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  ssr: true,

  css: ['./app/assets/styles/index.scss'],

  alias: {
    '@server': r('./server'),
    '@stores': r('./stores'),
    '@types': r('./types'),
    '@vendor': r('./vendor'),
    '@webgl': r('./webgl'),
    bidello: r('./vendor/bidello')
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5',
      htmlAttrs: { lang: 'fr' },
      title: siteTitle,
      meta: [
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'robots', content: 'all' },
        { name: 'description', content: siteDesc },
        // Open Graph (Facebook)
        { name: 'og:type', content: 'website' },
        { name: 'og:url', content: siteUrl },
        { name: 'og:title', content: siteTitle },
        { name: 'og:description', content: siteDesc },
        { name: 'og:image', content: imageUrl },
        { name: 'og:image:width', content: 1200 },
        { name: 'og:image:height', content: 630 },
        // Twitter Card
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:site', content: siteTitle },
        { name: 'twitter:title', content: siteTitle },
        { name: 'twitter:description', content: siteDesc },
        { name: 'twitter:image', content: imageUrl },
        { name: 'theme-color', content: '#000' }
      ],
      link: [
        { rel: 'canonical', href: siteUrl },
        { rel: 'icon', type: 'image/svg+xml', href: '/fav/favicon.svg' },
        { rel: 'alternate icon', type: 'image/png', sizes: '32x32', href: '/fav/favicon.png' },
        { rel: 'apple-touch-icon', href: '/fav/apple-touch.png' },
        { crossorigin: 'use-credentials', rel: 'manifest', href: '/fav/manifest.json' }
      ]
    }
  },

  sitemap: {
    hostname: siteUrl,
    gzip: true,
    routes: ['/']
  },

  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxtjs/sitemap', '@pinia/nuxt'],

  // runtimeConfig: {
  //   apiSecret: "",
  //   public: {
  //     r2PublicUrl: process.env.R2_PUBLIC_URL || "",
  //     siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
  //   },
  // },

  image: {
    format: ['webp', 'avif'],
    screens: {
      xs: 480,
      sm: 768,
      md: 1024,
      lg: 1440,
      xl: 1920,
      xxl: 2560
    }
  },

  pinia: {
    storesDirs: ['./stores/**']
  },

  build: {
    transpile: ['three', 'gsap']
  },

  vite: {
    plugins: [
      glsl({
        include: ['**/*.glsl', '**/*.vert', '**/*.frag'],
        warnDuplicatedImports: true,
        defaultExtension: 'glsl',
        watch: false,
        root: '/'
      })
    ],
    optimizeDeps: {
      include: ['three', 'gsap', 'lenis', 'split-type'],
      exclude: ['tweakpane']
    },
    ssr: {
      noExternal: ['gsap']
    },
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          logger: {
            // Supprime les warnings de dépendances SCSS
            warn: () => {}
          }
        }
      }
    }
  },

  typescript: {
    strict: true,
    typeCheck: false,
    shim: false
  },

  experimental: {
    inlineSSRStyles: false,
    payloadExtraction: true,
    renderJsonPayloads: true,
    componentIslands: true,
    headNext: true,
    viewTransition: true,
    externalVue: false,
    scanPageMeta: true,
    writeEarlyHints: true,
    inlineRouteRules: true
  },

  features: {
    inlineStyles: false,
    noScripts: false
  }
} as InputConfig<NuxtConfig>)
