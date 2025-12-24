# Internationalization (i18n)

Complete guide for the multi-language support system using next-intl.

## 📚 Overview

The project supports multiple languages with:

- ✅ **English (en)** - Default language
- ✅ **Bulgarian (bg)** - Български
- 🔧 **Easy to add more languages**

## 🚀 Technology Stack

- **[next-intl](https://next-intl-docs.vercel.app/)** - Next.js internationalization
- **TypeScript** - Type-safe translations
- **JSON** - Translation files

## 📁 File Structure

```
venues/
├── messages/
│   ├── en.json                    # English translations
│   └── bg.json                    # Bulgarian translations
│
├── src/
│   ├── i18n/
│   │   └── request.ts             # i18n configuration
│   ├── lib/
│   │   └── i18n.ts                # Helper functions & hooks
│   └── middleware.ts              # Locale routing middleware
│
└── next.config.ts                 # Next.js config with i18n
```

## 🛠️ Configuration

### 1. Supported Locales

Defined in `src/i18n/request.ts`:

```typescript
export const locales = ["en", "bg"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
```

### 2. Middleware

Automatic locale detection and routing in `src/middleware.ts`:

```typescript
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n/request";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always", // Always use /en or /bg prefix
});
```

### 3. Next.js Config

Integration in `next.config.ts`:

```typescript
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
```

## 📖 Usage

### In Client Components

```typescript
"use client";

import { useTranslations } from "next-intl";

export function LoginForm() {
  const t = useTranslations("auth");

  return (
    <div>
      <h1>{t("titles.login")}</h1>
      <button>{t("signIn")}</button>
      <p>{t("noAccount")}</p>
    </div>
  );
}
```

### Using Custom Hooks

```typescript
import { useAuthTranslations } from "@/lib/i18n";

export function RegisterForm() {
  const t = useAuthTranslations();

  return (
    <form>
      <h1>{t("titles.register")}</h1>
      <input placeholder={t("placeholders.email")} />
      <input placeholder={t("placeholders.password")} />
      <button>{t("signUp")}</button>
    </form>
  );
}
```

### In Server Components

```typescript
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("common");

  return (
    <div>
      <h1>{t("welcome")}</h1>
    </div>
  );
}
```

### Available Helper Hooks

```typescript
import {
  useAuthTranslations, // auth.*
  useCommonTranslations, // common.*
  useNavigationTranslations, // navigation.*
  useValidationTranslations, // validation.*
  useErrorTranslations, // errors.*
} from "@/lib/i18n";
```

## 🌍 Translation Files

### English (en.json)

```json
{
  "common": {
    "appName": "Venues",
    "welcome": "Welcome",
    "loading": "Loading..."
  },
  "auth": {
    "login": "Login",
    "register": "Register",
    "email": "Email",
    "password": "Password"
  }
}
```

### Bulgarian (bg.json)

```json
{
  "common": {
    "appName": "Venues",
    "welcome": "Добре дошли",
    "loading": "Зареждане..."
  },
  "auth": {
    "login": "Вход",
    "register": "Регистрация",
    "email": "Имейл",
    "password": "Парола"
  }
}
```

## 🔗 Routing

All routes are automatically prefixed with the locale:

```
/en/login          → English login page
/bg/login          → Bulgarian login page
/en/dashboard      → English dashboard
/bg/dashboard      → Bulgarian dashboard
```

### Link Component

```typescript
import { Link } from "@/i18n/routing";

export function Navigation() {
  return (
    <nav>
      <Link href="/dashboard">Dashboard</Link>
      {/* Automatically uses current locale */}
    </nav>
  );
}
```

### Programmatic Navigation

```typescript
"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export function MyComponent() {
  const router = useRouter();
  const locale = useLocale();

  const handleNavigate = () => {
    router.push(`/${locale}/dashboard`);
  };

  return <button onClick={handleNavigate}>Go to Dashboard</button>;
}
```

## 🎛️ Language Switcher

Create a language switcher component:

```typescript
"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { getAllLocales } from "@/lib/i18n";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const locales = getAllLocales();

  const switchLocale = (newLocale: string) => {
    // Replace current locale in pathname
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  return (
    <select value={locale} onChange={(e) => switchLocale(e.target.value)}>
      {locales.map((loc) => (
        <option key={loc.code} value={loc.code}>
          {loc.flag} {loc.name}
        </option>
      ))}
    </select>
  );
}
```

## 📝 Translation Keys Structure

### Common Translations

```json
{
  "common": {
    "appName": "App name",
    "welcome": "Welcome message",
    "loading": "Loading state",
    "error": "Error label",
    "success": "Success label",
    "cancel": "Cancel button",
    "confirm": "Confirm button",
    "save": "Save button",
    "delete": "Delete button",
    "edit": "Edit button",
    "create": "Create button"
  }
}
```

### Authentication Translations

```json
{
  "auth": {
    "login": "Login label",
    "register": "Register label",
    "email": "Email label",
    "password": "Password label",

    "titles": {
      "login": "Login page title",
      "register": "Register page title"
    },

    "messages": {
      "loginSuccess": "Success message",
      "registerSuccess": "Registration message"
    },

    "errors": {
      "emailRequired": "Email required error",
      "passwordMin": "Password length error"
    },

    "placeholders": {
      "email": "Email input placeholder",
      "password": "Password input placeholder"
    }
  }
}
```

## ✨ Best Practices

### 1. Namespacing

Organize translations by feature/domain:

```typescript
// ✅ Good - organized
t("auth.titles.login");
t("dashboard.welcome");
t("settings.profile.title");

// ❌ Bad - flat structure
t("loginTitle");
t("welcomeMessage");
```

### 2. Type Safety

Use TypeScript for translations:

```typescript
import { useTranslations } from "next-intl";

// Type-safe translation keys
const t = useTranslations("auth");
const title = t("titles.login"); // ✅ Autocomplete works
```

### 3. Pluralization

```json
{
  "items": {
    "zero": "No items",
    "one": "One item",
    "other": "{count} items"
  }
}
```

```typescript
t("items", { count: 0 }); // "No items"
t("items", { count: 1 }); // "One item"
t("items", { count: 5 }); // "5 items"
```

### 4. Rich Text

```json
{
  "terms": "I agree to the <link>terms and conditions</link>"
}
```

```typescript
t.rich("terms", {
  link: (chunks) => <Link href="/terms">{chunks}</Link>,
});
```

## 🔄 Adding a New Language

### 1. Create Translation File

Create `messages/fr.json` for French:

```json
{
  "common": {
    "appName": "Venues",
    "welcome": "Bienvenue"
  }
}
```

### 2. Update Locale Configuration

Edit `src/i18n/request.ts`:

```typescript
export const locales = ["en", "bg", "fr"] as const;
```

### 3. Update Helper Functions

Edit `src/lib/i18n.ts`:

```typescript
export function getLocaleDisplayName(locale: Locale): string {
  const names: Record<Locale, string> = {
    en: "English",
    bg: "Български",
    fr: "Français", // Add new
  };
  return names[locale];
}

export function getLocaleFlag(locale: Locale): string {
  const flags: Record<Locale, string> = {
    en: "🇬🇧",
    bg: "🇧🇬",
    fr: "🇫🇷", // Add new
  };
  return flags[locale];
}
```

### 4. Done! 🎉

The new language is automatically available at `/fr/*` routes.

## 🧪 Testing

### Test Translation Keys

```typescript
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en.json";

describe("LoginForm", () => {
  it("renders with English translations", () => {
    render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <LoginForm />
      </NextIntlClientProvider>
    );

    expect(screen.getByText("Login to your account")).toBeInTheDocument();
  });
});
```

## 🚀 Server Actions with i18n

```typescript
"use server";

import { getTranslations } from "next-intl/server";

export async function myAction() {
  const t = await getTranslations("auth.messages");

  return {
    success: true,
    message: t("loginSuccess"),
  };
}
```

## 📚 Related Documentation

- **[next-intl Documentation](https://next-intl-docs.vercel.app/)**
- **[AUTHENTICATION.md](./AUTHENTICATION.md)** - Auth system
- **[ARCHITECTURE.md](../ARCHITECTURE.md)** - System architecture

## 🎯 Summary

- ✅ **2 Languages**: English & Bulgarian
- ✅ **Type-safe**: Full TypeScript support
- ✅ **Auto-routing**: Locale prefix in URLs
- ✅ **Easy to extend**: Add new languages easily
- ✅ **SSR Ready**: Works with Server Components
- ✅ **Client-friendly**: Hooks for Client Components

**Next Steps**: Create language switcher component and translate all UI text!
