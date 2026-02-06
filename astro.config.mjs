import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://nexo.com',
  i18n: {
    defaultLocale: 'es',
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
