// @ts-check
import { defineConfig, fontProviders, svgoOptimizer } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import siteConfig from './src/site.config';
import remarkGfm from 'remark-gfm';
import rehypeUnwrapImages from 'rehype-unwrap-images';
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { rawFonts } from "./src/plugins/rawFonts";

// https://astro.build/config
export default defineConfig({
  site: siteConfig.url,

  image: {
    responsiveStyles: true,
  },

  experimental: {
    contentIntellisense: true,
    rustCompiler: true,
    queuedRendering: {
      enabled: true,
    },
    svgOptimizer: svgoOptimizer(),
  },

  security: {
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'", "https://static.cloudflareinsights.com"],
        "style-src":  ["'self'", "'unsafe-inline'"],
        "connect-src":["'self'", "https://cloudflareinsights.com"],
        "worker-src": ["'self'", "blob:"],
      },
    },
  },

  fonts: [
    {
      name: "Noto Sans",
      cssVariable: "--font-lipi-sans",
      provider: fontProviders.google(),
      weights: [300, 400, 500, 600, 700],
      fallbacks: ["sans-serif"],
      formats: ["woff", "ttf"],
    },
    {
      name: "Noto Serif",
      cssVariable: "--font-lipi-serif",
      provider: fontProviders.google(),
      weights: [300, 400, 500, 600, 700],
      fallbacks: ["serif"],
      formats: ["woff", "ttf"],
    },
    {
      name: "Noto Sans Mono",
      cssVariable: "--font-lipi-mono",
      provider: fontProviders.google(),
      weights: [ 400, 500, 600, 700],
      fallbacks: ["monospace"],
      formats: ["woff", "ttf"],
    },
    {
      name: "Shippori Mincho",
      cssVariable: "--font-lipi-display",
      provider: fontProviders.google(),
      weights: [ 400, 500, 600, 700],
      fallbacks: ["serif"],
      formats: ["woff", "ttf"],
    }
  ],

  i18n:{
    locales: ["en", "mr"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  
  vite: {
    optimizeDeps: {
			exclude: ["@resvg/resvg-js"],
		},
    plugins: [
      tailwindcss(),
      rawFonts([".ttf",".otf",]),
    ]
  },

  integrations: [
    mdx(), 
    sitemap()
  ],

  markdown: {
    remarkPlugins: [
      remarkGfm,
    ],

    rehypePlugins: [
      rehypeSlug,
      rehypeUnwrapImages,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: {
            className: [
              "heading-anchor",
            ],
            ariaLabel:
              "Copy heading link",
          },
          content: {
            type: "text",
            value: "↗",
          },
        },
      ],
    ],
  },
});