import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://clicroot.com',
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
