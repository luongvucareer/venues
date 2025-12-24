/**
 * Application error codes
 */
export type ErrorCode =
  | "VALIDATION_ERROR"
  | "AUTHENTICATION_ERROR"
  | "AUTHORIZATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

/**
 * Custom application error class
 * Note: message should be a translation key (e.g., "auth.messages.invalidCredentials")
 */
export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * Error message translation keys
 * These should be used with the i18n system (e.g., t(ErrorMessages.INVALID_CREDENTIALS))
 */
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
