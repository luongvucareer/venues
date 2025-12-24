import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

// Supported locales
export const locales = ["en", "bg"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// Validate that a locale is supported
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export default getRequestConfig(async ({ requestLocale }) => {
  // Get the locale from the request
  const locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!locale || !isValidLocale(locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
