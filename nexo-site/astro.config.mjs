import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://nexo.com',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true
    }
  },
  build: {
    format: 'directory'
  }
});
