import i18n from '@/lib/i18n';
import { Locale } from '@/types/user-perference';

type LocaleRefLike = {
  value: Locale;
};

type GlobalLocaleLike = {
  locale: LocaleRefLike | Locale;
};

const isLocaleRefLike = (value: unknown): value is LocaleRefLike => {
  return typeof value === 'object' && value !== null && 'value' in value;
};

const isLocale = (value: unknown): value is Locale => {
  return typeof value === 'string' && Object.values(Locale).includes(value as Locale);
};

export const getI18nLocale = (): Locale => {
  const globalLocale = (i18n.global as unknown as GlobalLocaleLike).locale;
  const localeValue = isLocaleRefLike(globalLocale) ? globalLocale.value : globalLocale;
  return isLocale(localeValue) ? localeValue : Locale.EN;
};

export const setI18nLocale = (locale: Locale): void => {
  const globalI18n = i18n.global as unknown as GlobalLocaleLike;

  if (isLocaleRefLike(globalI18n.locale)) {
    globalI18n.locale.value = locale;
    return;
  }

  globalI18n.locale = locale;
};
