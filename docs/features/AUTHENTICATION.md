# Authentication System

Complete documentation for the authentication system implementation.

## Overview

Our authentication system provides:

- ✅ Email/Password registration with verification
- ✅ Google OAuth login
- ✅ Email verification (required before login)
- ✅ Session management
- ✅ Role-based access control (RBAC)
- ✅ Password security (bcrypt)
- ✅ Rate limiting
- ✅ Secure token generation

## Technology Stack

- **NextAuth.js v5** - Authentication framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Resend** - Email service
- **bcrypt** - Password hashing
- **Zod** - Input validation

## Database Schema

```prisma
enum UserRole {
  USER
  ADMIN
  MODERATOR
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  password      String?   // Null for OAuth users
  image         String?
  role          UserRole  @default(USER)

  accounts      Account[]
  sessions      Session[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  id         String   @id @default(cuid())
  identifier String   // email
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

## Authentication Flow

### 1. Email/Password Registration

```
┌─────────────┐
│ User fills  │
│ signup form │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ Validate input      │
│ (email, password)   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Check if email      │
│ already exists      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Hash password       │
│ (bcrypt)            │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Create user         │
│ (emailVerified=null)│
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Generate token      │
│ (expires in 24h)    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Send verification   │
│ email (Resend)      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Show "Check email"  │
│ message             │
└─────────────────────┘
```

### 2. Email Verification

```
┌─────────────────┐
│ User clicks     │
│ email link      │
└──────┬──────────┘
       │
       ▼
┌─────────────────────┐
│ Verify token exists │
│ and not expired     │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Update user:        │
│ emailVerified = now │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Delete token        │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Redirect to login   │
│ with success msg    │
└─────────────────────┘
```

### 3. Email/Password Login

```
┌─────────────────┐
│ User submits    │
│ credentials     │
└──────┬──────────┘
       │
       ▼
┌─────────────────────┐
│ Validate input      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Find user by email  │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Check if email      │
│ is verified         │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Verify password     │
│ (bcrypt.compare)    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Create session      │
│ (NextAuth)          │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Redirect to         │
│ dashboard           │
└─────────────────────┘
```

### 4. Google OAuth Login

```
┌─────────────────┐
│ User clicks     │
│ "Sign in with   │
│  Google"        │
└──────┬──────────┘
       │
       ▼
┌─────────────────────┐
│ Redirect to Google  │
│ OAuth consent       │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ User authorizes     │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Google redirects    │
│ back with code      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ NextAuth exchanges  │
│ code for tokens     │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Create/update user  │
│ emailVerified = now │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Create Account      │
│ record              │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Create session      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Redirect to         │
│ dashboard           │
└─────────────────────┘
```

## Implementation

### Layer 1: Validation Schemas

```typescript
// lib/validations/auth.schema.ts
import { z } from "zod";

export const emailSchema = z
  .string()
  .email("Invalid email address")
  .toLowerCase()
  .trim();

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain uppercase letter")
  .regex(/[a-z]/, "Must contain lowercase letter")
  .regex(/[0-9]/, "Must contain number")
  .regex(/[^A-Za-z0-9]/, "Must contain special character");

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
```

### Layer 2: Repository

```typescript
// repositories/auth.repository.ts
import { prisma } from "@/lib/prisma";
import type { User, VerificationToken } from "@prisma/client";

export const authRepository = {
  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async createUser(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    return prisma.user.create({
      data,
    });
  },

  async createVerificationToken(data: {
    identifier: string;
    token: string;
    expires: Date;
  }): Promise<VerificationToken> {
    return prisma.verificationToken.create({
      data,
    });
  },

  async findVerificationToken(
    token: string
  ): Promise<VerificationToken | null> {
    return prisma.verificationToken.findUnique({
      where: { token },
    });
  },

  async verifyUserEmail(email: string): Promise<User> {
    return prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });
  },

  async deleteVerificationToken(token: string): Promise<void> {
    await prisma.verificationToken.delete({
      where: { token },
    });
  },
};
```

### Layer 3: Service

```typescript
// services/auth.service.ts
import { authRepository } from "@/repositories/auth.repository";
import { hashPassword, verifyPassword } from "@/lib/password";
import { generateToken } from "@/lib/crypto";
import { sendVerificationEmail } from "@/lib/email";
import { AppError } from "@/lib/errors/app-error";
import type { RegisterInput, LoginInput } from "@/lib/validations/auth.schema";

export const authService = {
  async register(data: RegisterInput) {
    // Check if user already exists
    const existing = await authRepository.findUserByEmail(data.email);
    if (existing) {
      throw new AppError("VALIDATION_ERROR", "Email already registered");
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user (not verified)
    const user = await authRepository.createUser({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    // Generate verification token
    const token = generateToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await authRepository.createVerificationToken({
      identifier: user.email,
      token,
      expires,
    });

    // Send verification email
    await sendVerificationEmail(user.email, token);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  },

  async verifyEmail(token: string) {
    // Find token
    const verificationToken = await authRepository.findVerificationToken(token);

    if (!verificationToken) {
      throw new AppError("VALIDATION_ERROR", "Invalid or expired token");
    }

    // Check if expired
    if (verificationToken.expires < new Date()) {
      await authRepository.deleteVerificationToken(token);
      throw new AppError("VALIDATION_ERROR", "Token has expired");
    }

    // Verify email
    const user = await authRepository.verifyUserEmail(
      verificationToken.identifier
    );

    // Delete token
    await authRepository.deleteVerificationToken(token);

    return user;
  },

  async validateCredentials(data: LoginInput) {
    // Find user
    const user = await authRepository.findUserByEmail(data.email);

    if (!user || !user.password) {
      throw new AppError("VALIDATION_ERROR", "Invalid credentials");
    }

    // Check if email is verified
    if (!user.emailVerified) {
      throw new AppError(
        "VALIDATION_ERROR",
        "Please verify your email before logging in"
      );
    }

    // Verify password
    const isValid = await verifyPassword(data.password, user.password);

    if (!isValid) {
      throw new AppError("VALIDATION_ERROR", "Invalid credentials");
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  },

  async resendVerificationEmail(email: string) {
    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      throw new AppError("NOT_FOUND", "User not found");
    }

    if (user.emailVerified) {
      throw new AppError("VALIDATION_ERROR", "Email already verified");
    }

    // Generate new token
    const token = generateToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await authRepository.createVerificationToken({
      identifier: user.email,
      token,
      expires,
    });

    await sendVerificationEmail(user.email, token);

    return { success: true };
  },
};
```

### Layer 4: Server Actions

```typescript
// actions/auth.actions.ts
"use server";

import { authService } from "@/services/auth.service";
import {
  registerSchema,
  verifyEmailSchema,
} from "@/lib/validations/auth.schema";
import { handleError } from "@/lib/errors/error-handler";
import { signIn } from "@/lib/auth";
import type { ActionResponse } from "@/types/api/responses";

/**
 * Register new user with email and password
 */
export async function registerUser(
  data: unknown
): Promise<ActionResponse<{ email: string }>> {
  try {
    const validated = registerSchema.parse(data);
    const user = await authService.register(validated);

    return {
      success: true,
      data: { email: user.email },
    };
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Verify user email with token
 */
export async function verifyEmail(
  data: unknown
): Promise<ActionResponse<void>> {
  try {
    const { token } = verifyEmailSchema.parse(data);
    await authService.verifyEmail(token);

    return { success: true, data: undefined };
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Resend verification email
 */
export async function resendVerification(
  email: string
): Promise<ActionResponse<void>> {
  try {
    await authService.resendVerificationEmail(email);
    return { success: true, data: undefined };
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Sign in with credentials (handled by NextAuth)
 */
export async function signInWithCredentials(data: unknown) {
  try {
    const { email, password } = data as { email: string; password: string };

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!result?.ok) {
      return { success: false, error: "Invalid credentials" };
    }

    return { success: true, data: undefined };
  } catch (error) {
    return handleError(error);
  }
}
```

### NextAuth Configuration

```typescript
// lib/auth.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authService } from "@/services/auth.service";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const user = await authService.validateCredentials({
            email: credentials.email as string,
            password: credentials.password as string,
          });

          return user;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Auto-verify OAuth users
      if (account?.provider === "google") {
        return true;
      }

      // Check email verification for credentials
      if (!user.emailVerified) {
        return "/auth/verify-email";
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
```

## Security Features

### 1. Password Security

```typescript
// lib/password.ts
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### 2. Token Generation

```typescript
// lib/crypto.ts
import { randomBytes } from "crypto";

export function generateToken(): string {
  return randomBytes(32).toString("hex");
}
```

### 3. Rate Limiting

```typescript
// Rate limit login attempts
await checkRateLimit(email, "login"); // 5 attempts per 15 min
```

## Email Templates

```typescript
// lib/email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const url = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`;

  await resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to: email,
    subject: "Verify your email address",
    html: `
      <h1>Verify your email</h1>
      <p>Click the link below to verify your email address:</p>
      <a href="${url}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `,
  });
}
```

## Testing

See complete test examples in [TESTING.md](../backend/TESTING.md)

## See Also

- [ARCHITECTURE.md](../ARCHITECTURE.md) - Overall architecture
- [SERVER_ACTIONS.md](../backend/SERVER_ACTIONS.md) - Server Actions guide
- [SECURITY.md](../backend/SECURITY.md) - Security best practices
