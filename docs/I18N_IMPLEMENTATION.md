# Internationalization (i18n) Implementation

## Overview

This document describes how internationalization (i18n) is implemented throughout the application using `next-intl`.

## ✅ Complete i18n Integration

### 1. **Error Messages** (Translation Keys)

All error messages use translation keys instead of hardcoded strings:

**File: `src/lib/errors.ts`**

```typescript
export const ErrorMessages = {
  // Authentication errors - mapped to translation keys
  INVALID_CREDENTIALS: "auth.messages.invalidCredentials",
  EMAIL_ALREADY_EXISTS: "auth.messages.emailAlreadyExists",
  EMAIL_ALREADY_VERIFIED: "auth.messages.emailAlreadyVerified",
  USER_NOT_FOUND: "auth.messages.userNotFound",
  EMAIL_NOT_VERIFIED: "auth.messages.emailNotVerified",
  INVALID_TOKEN: "auth.messages.invalidToken",

  // Authorization errors
  UNAUTHORIZED: "errors.unauthorized",
  FORBIDDEN: "errors.forbidden",

  // Validation errors
  INVALID_INPUT: "validation.invalid",

  // Generic errors
  INTERNAL_ERROR: "errors.internalError",
} as const;
```

### 2. **Service Layer** (Backend)

Services throw errors with translation keys:

**File: `src/services/auth.service.ts`**

```typescript
// Example: Using translation keys
throw new AppError("CONFLICT", ErrorMessages.EMAIL_ALREADY_EXISTS);
throw new AppError("AUTHENTICATION_ERROR", ErrorMessages.INVALID_CREDENTIALS);
throw new AppError("VALIDATION_ERROR", ErrorMessages.EMAIL_ALREADY_VERIFIED);
```

### 3. **Server Actions** (Backend → Frontend Bridge)

Server actions translate error messages based on user's locale:

**File: `src/actions/auth.actions.ts`**

```typescript
export async function registerAction(data: unknown) {
  try {
    const t = await getTranslations("auth.messages");
    const result = await authService.register(validated);

    return {
      success: true,
      data: result,
      message: t("registerSuccess"), // Translated message
    };
  } catch (error) {
    return handleAuthError(error); // Translates errors
  }
}

async function handleAuthError(error: unknown) {
  const t = await getTranslations("auth");

  if (error instanceof AppError) {
    // Map error codes to translated messages
    const errorMessages: Record<string, string> = {
      EMAIL_EXISTS: t("messages.emailAlreadyExists"),
      INVALID_CREDENTIALS: t("messages.invalidCredentials"),
      EMAIL_NOT_VERIFIED: t("messages.emailNotVerified"),
      // ... etc
    };

    return {
      success: false,
      error: errorMessages[error.code] || error.message,
    };
  }
}
```

### 4. **Translation Files**

All messages are defined in both languages:

**`messages/en.json`** and **`messages/bg.json`**:

```json
{
  "auth": {
    "messages": {
      "loginSuccess": "Login successful",
      "registerSuccess": "Registration successful. Please verify your email.",
      "emailVerified": "Email verified successfully",
      "emailAlreadyVerified": "Email is already verified",
      "invalidCredentials": "Invalid email or password",
      "emailAlreadyExists": "Email already exists",
      "userNotFound": "User not found",
      "emailNotVerified": "Please verify your email first",
      "invalidToken": "Invalid or expired token"
    },
    "errors": {
      "emailRequired": "Email is required",
      "passwordRequired": "Password is required"
      // ... validation errors
    }
  },
  "errors": {
    "unauthorized": "Unauthorized",
    "forbidden": "Forbidden",
    "internalError": "Internal server error"
  },
  "validation": {
    "required": "This field is required",
    "invalid": "Invalid value"
  }
}
```

## Architecture Flow

```
┌─────────────────┐
│  Service Layer  │ → Throws AppError with translation key
│  (Backend)      │    e.g., ErrorMessages.INVALID_CREDENTIALS
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Server Actions  │ → Catches error & translates to user's locale
│  (Bridge)       │    using getTranslations()
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Client/UI      │ → Receives already translated message
│  (Frontend)     │    in the user's selected language
└─────────────────┘
```

## Key Benefits

1. **✅ Backend Remains Locale-Agnostic**
   - Services use translation keys (not hardcoded strings)
   - Business logic is independent of language

2. **✅ Translation Happens at Action Layer**
   - Server Actions detect user's locale
   - Translate messages before sending to client
   - Clean separation of concerns

3. **✅ Type-Safe**
   - Translation keys are constants
   - TypeScript ensures correct usage

4. **✅ Consistent UX**
   - All error messages translated
   - All success messages translated
   - All validation messages translated

## How to Add New Translated Messages

### Step 1: Add to Translation Files

**`messages/en.json`:**

```json
{
  "auth": {
    "messages": {
      "newMessage": "This is a new message"
    }
  }
}
```

**`messages/bg.json`:**

```json
{
  "auth": {
    "messages": {
      "newMessage": "Това е ново съобщение"
    }
  }
}
```

### Step 2: Add to ErrorMessages (if it's an error)

**`src/lib/errors.ts`:**

```typescript
export const ErrorMessages = {
  // ... existing
  NEW_ERROR: "auth.messages.newMessage",
} as const;
```

### Step 3: Use in Service

**`src/services/auth.service.ts`:**

```typescript
throw new AppError("VALIDATION_ERROR", ErrorMessages.NEW_ERROR);
```

### Step 4: Handle in Server Action

**`src/actions/auth.actions.ts`:**

```typescript
async function handleAuthError(error: unknown) {
  const t = await getTranslations("auth");

  if (error instanceof AppError) {
    const errorMessages: Record<string, string> = {
      // ... existing
      NEW_ERROR: t("messages.newMessage"),
    };
    // ...
  }
}
```

## Supported Locales

Currently supporting:

- **English** (`en`) - Default
- **Bulgarian** (`bg`)

To add more locales:

1. Update `src/i18n/request.ts`: `export const locales = ["en", "bg", "fr"] as const;`
2. Create `messages/fr.json` with all translations
3. Update middleware if needed

## Client-Side Translation

For client components, use the `useTranslations` hook:

```typescript
'use client';
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('auth.messages');

  return <div>{t('loginSuccess')}</div>;
}
```

## Server-Side Translation

For server components and server actions:

```typescript
import { getTranslations } from "next-intl/server";

export async function myServerAction() {
  const t = await getTranslations("auth.messages");

  return {
    message: t("loginSuccess"),
  };
}
```

## Best Practices

1. **Never hardcode user-facing strings** - Always use translation keys
2. **Group related translations** - Use nested structure (auth.messages, auth.errors, etc.)
3. **Keep keys descriptive** - `invalidCredentials` is better than `error1`
4. **Translate at the edge** - Services use keys, Actions translate
5. **Maintain consistency** - Same message structure in all language files

## Files Modified for i18n

- ✅ `src/lib/errors.ts` - Error message keys
- ✅ `src/services/auth.service.ts` - Uses translation keys
- ✅ `src/actions/auth.actions.ts` - Translates messages
- ✅ `messages/en.json` - English translations (100+ keys)
- ✅ `messages/bg.json` - Bulgarian translations (100+ keys)
- ✅ `src/i18n/request.ts` - i18n configuration
- ✅ `src/middleware.ts` - Locale detection & routing
- ✅ `src/app/[locale]/layout.tsx` - Locale provider

## Testing i18n

Access different locales:

- English: `http://localhost:3000/en`
- Bulgarian: `http://localhost:3000/bg`

The middleware automatically redirects `/` to `/en` (default locale).
