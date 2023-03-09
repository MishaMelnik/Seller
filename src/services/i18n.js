import locale from '../i18n/locale-ru';

export function t(key) {
  return locale[key] || key;
}
