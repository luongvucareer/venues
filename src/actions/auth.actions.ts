"use server";

import { AppError } from "@/lib/errors";
import {
  LoginInput,
  loginSchema,
  RegisterInput,
  registerSchema,
  VerifyEmailInput,
  verifyEmailSchema,
} from "@/lib/validations/auth";
import { authService } from "@/services/auth.service";
import { ActionResponse } from "@/types/api";
import { UserDTO } from "@/types/auth";
import { getTranslations } from "next-intl/server";
import { ZodError } from "zod";

/**
 * Register a new user
 * @param data - Registration data (unvalidated)
 */
export async function registerAction(
  data: unknown
): Promise<ActionResponse<{ user: UserDTO; verificationToken: string }>> {
  try {
    const t = await getTranslations("auth.messages");

    // Validate input
    const validated = registerSchema.parse(data) as RegisterInput;

    // Call service
    const result = await authService.register(validated);

    return {
      success: true,
      data: result,
      message: t("registerSuccess"),
    };
  } catch (error) {
    return handleAuthError(error);
  }
}

/**
 * Login user
 * @param data - Login credentials (unvalidated)
 */
export async function loginAction(
  data: unknown
): Promise<ActionResponse<UserDTO>> {
  try {
    const t = await getTranslations("auth.messages");

    // Validate input
    const validated = loginSchema.parse(data) as LoginInput;

    // Call service
    const user = await authService.login(validated);

    return {
      success: true,
      data: user,
      message: t("loginSuccess"),
    };
  } catch (error) {
    return handleAuthError(error);
  }
}

/**
 * Verify email with token
 * @param data - Verification data (unvalidated)
 */
export async function verifyEmailAction(
  data: unknown
): Promise<ActionResponse<UserDTO>> {
  try {
    const t = await getTranslations("auth.messages");

    // Validate input
    const validated = verifyEmailSchema.parse(data) as VerifyEmailInput;

    // Call service
    const user = await authService.verifyEmail(validated.token);

    return {
      success: true,
      data: user,
      message: t("emailVerified"),
    };
  } catch (error) {
    return handleAuthError(error);
  }
}

/**
 * Resend verification email
 * @param email - User email
 */
export async function resendVerificationAction(
  email: string
): Promise<ActionResponse<{ token: string }>> {
  try {
    const t = await getTranslations("auth.messages");

    // Call service
    const token = await authService.resendVerification(email);

    return {
      success: true,
      data: { token },
      message: t("verificationSent"),
    };
  } catch (error) {
    return handleAuthError(error);
  }
}

/**
 * Get current user by ID
 * @param userId - User ID
 */
export async function getUserAction(
  userId: string
): Promise<ActionResponse<UserDTO>> {
  try {
    const t = await getTranslations("auth.messages");

    const user = await authService.getUserById(userId);

    if (!user) {
      return {
        success: false,
        error: t("userNotFound"),
      };
    }

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    return handleAuthError(error);
  }
}

/**
 * Handle authentication errors
 */
async function handleAuthError(error: unknown): Promise<ActionResponse<never>> {
  const t = await getTranslations("auth");

  // Zod validation error
  if (error instanceof ZodError) {
    return {
      success: false,
      error: await getTranslations("validation").then((t) => t("required")),
      errors: error.flatten().fieldErrors,
    };
  }

  // Application error
  if (error instanceof AppError) {
    // Map error codes to translation keys
    const errorMessages: Record<string, string> = {
      EMAIL_EXISTS: t("messages.emailAlreadyExists"),
      INVALID_CREDENTIALS: t("messages.invalidCredentials"),
      EMAIL_NOT_VERIFIED: t("messages.emailNotVerified"),
      USER_NOT_FOUND: t("messages.userNotFound"),
      INVALID_TOKEN: t("messages.invalidToken"),
    };

    return {
      success: false,
      error: errorMessages[error.code] || error.message,
    };
  }

  // Unknown error
  console.error("Unexpected error in auth action:", error);
  return {
    success: false,
    error: t("errors.unexpectedError"),
  };
}
