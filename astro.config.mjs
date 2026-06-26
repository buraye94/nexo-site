import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://clicroot.com',
  integrations: [
    sitemap({
      filter: (page) => page !== 'https://clicroot.com/es/' && !page.includes('/admin'),
    }),
  ],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false
    }
  },
  build: {
    format: 'directory'
  }
});
