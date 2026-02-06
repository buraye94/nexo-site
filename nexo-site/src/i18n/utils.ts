import en from './en.json';
import es from './es.json';

const translations: Record<string, any> = { en, es };

export function t(lang: string, key: string): any {
  const keys = key.split('.');
  let value: any = translations[lang] || translations['en'];
  for (const k of keys) {
    value = value?.[k];
  }
  return value ?? key;
}

export function getLangFromUrl(url: URL): string {
  const [, lang] = url.pathname.split('/');
  if (lang === 'es') return 'es';
  return 'en';
}

export function getAlternateUrl(url: URL, targetLang: string): string {
  const currentLang = getLangFromUrl(url);
  return url.pathname.replace(`/${currentLang}`, `/${targetLang}`);
}
