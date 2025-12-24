import crypto from "crypto";

/**
 * Generate a random verification token
 * @returns Random token string
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Generate token expiry time
 * @param hours - Number of hours until expiry (default: 24)
 * @returns Date object for expiry time
 */
export function generateTokenExpiry(hours: number = 24): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

/**
 * Check if a token has expired
 * @param expiryDate - Token expiry date
 * @returns True if token has expired
 */
export function isTokenExpired(expiryDate: Date): boolean {
  return new Date() > expiryDate;
}
