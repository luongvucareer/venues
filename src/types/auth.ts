import { UserRole } from "@prisma/client";

/**
 * User data transfer object (without sensitive fields)
 */
export interface UserDTO {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Session user data
 */
export interface SessionUser {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  emailVerified: Date | null;
}

/**
 * Authentication result
 */
export interface AuthResult {
  success: boolean;
  user?: UserDTO;
  message?: string;
}

/**
 * Verification token data
 */
export interface VerificationTokenData {
  id: string;
  identifier: string;
  token: string;
  expires: Date;
}
