/**
 * i18n Utility Functions
 * Helper functions for internationalization
 */

import { locales, type Locale } from "@/i18n/request";
import { useTranslations } from "next-intl";

/**
 * Get locale display name
 */
export function getLocaleDisplayName(locale: Locale): string {
  const names: Record<Locale, string> = {
    en: "English",
    bg: "Български",
  };
  return names[locale];
}

/**
 * Get locale flag emoji
 */
export function getLocaleFlag(locale: Locale): string {
  const flags: Record<Locale, string> = {
    en: "🇬🇧",
    bg: "🇧🇬",
  };
  return flags[locale];
}

/**
 * Get all locales with metadata
 */
export function getAllLocales() {
  return locales.map((locale) => ({
    code: locale,
    name: getLocaleDisplayName(locale),
    flag: getLocaleFlag(locale),
  }));
}

/**
 * Custom hook for auth translations
 */
export function useAuthTranslations() {
  return useTranslations("auth");
}

/**
 * Custom hook for common translations
 */
export function useCommonTranslations() {
  return useTranslations("common");
}

/**
 * Custom hook for navigation translations
 */
export function useNavigationTranslations() {
  return useTranslations("navigation");
}

/**
 * Custom hook for validation translations
 */
export function useValidationTranslations() {
  return useTranslations("validation");
}

/**
 * Custom hook for error translations
 */
export function useErrorTranslations() {
  return useTranslations("errors");
}
