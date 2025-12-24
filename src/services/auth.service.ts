import { AppError, ErrorMessages } from "@/lib/errors";
import { hashPassword, verifyPassword } from "@/lib/password";
import {
  generateTokenExpiry,
  generateVerificationToken,
  isTokenExpired,
} from "@/lib/tokens";
import { LoginInput, RegisterInput } from "@/lib/validations/auth";
import { userRepository } from "@/repositories/user.repository";
import { verificationTokenRepository } from "@/repositories/verification-token.repository";
import { UserDTO } from "@/types/auth";
import { User } from "@prisma/client";

/**
 * Auth service - contains all authentication business logic
 */
export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterInput): Promise<{
    user: UserDTO;
    verificationToken: string;
  }> {
    // Check if email already exists
    const emailExists = await userRepository.emailExists(data.email);
    if (emailExists) {
      throw new AppError("CONFLICT", ErrorMessages.EMAIL_ALREADY_EXISTS);
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await userRepository.create({
      email: data.email,
      name: data.name,
      password: hashedPassword,
    });

    // Generate verification token
    const token = generateVerificationToken();
    const expires = generateTokenExpiry(24); // 24 hours

    await verificationTokenRepository.create({
      identifier: user.email,
      token,
      expires,
    });

    // Return user (without password) and token
    return {
      user: this.toUserDTO(user),
      verificationToken: token,
    };
  },

  /**
   * Login user with email and password
   */
  async login(data: LoginInput): Promise<UserDTO> {
    // Find user by email
    const user = await userRepository.findByEmail(data.email);
    if (!user || !user.password) {
      throw new AppError(
        "AUTHENTICATION_ERROR",
        ErrorMessages.INVALID_CREDENTIALS
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(data.password, user.password);
    if (!isValidPassword) {
      throw new AppError(
        "AUTHENTICATION_ERROR",
        ErrorMessages.INVALID_CREDENTIALS
      );
    }

    // Check if email is verified
    if (!user.emailVerified) {
      throw new AppError(
        "AUTHENTICATION_ERROR",
        ErrorMessages.EMAIL_NOT_VERIFIED
      );
    }

    return this.toUserDTO(user);
  },

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<UserDTO> {
    // Find token
    const verificationToken =
      await verificationTokenRepository.findByTokenValue(token);

    if (!verificationToken) {
      throw new AppError("AUTHENTICATION_ERROR", ErrorMessages.INVALID_TOKEN);
    }

    // Check if token is expired
    if (isTokenExpired(verificationToken.expires)) {
      // Delete expired token
      await verificationTokenRepository.deleteByIdentifier(
        verificationToken.identifier
      );
      throw new AppError("AUTHENTICATION_ERROR", ErrorMessages.INVALID_TOKEN);
    }

    // Find user by email
    const user = await userRepository.findByEmail(verificationToken.identifier);
    if (!user) {
      throw new AppError("NOT_FOUND", ErrorMessages.USER_NOT_FOUND);
    }

    // Verify email
    const verifiedUser = await userRepository.verifyEmail(user.id);

    // Delete token after successful verification
    await verificationTokenRepository.delete(
      verificationToken.identifier,
      verificationToken.token
    );

    return this.toUserDTO(verifiedUser);
  },

  /**
   * Resend verification email
   */
  async resendVerification(email: string): Promise<string> {
    // Find user
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError("NOT_FOUND", ErrorMessages.USER_NOT_FOUND);
    }

    // Check if already verified
    if (user.emailVerified) {
      throw new AppError(
        "VALIDATION_ERROR",
        ErrorMessages.EMAIL_ALREADY_VERIFIED
      );
    }

    // Delete old tokens
    await verificationTokenRepository.deleteByIdentifier(email);

    // Generate new token
    const token = generateVerificationToken();
    const expires = generateTokenExpiry(24);

    await verificationTokenRepository.create({
      identifier: email,
      token,
      expires,
    });

    return token;
  },

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<UserDTO | null> {
    const user = await userRepository.findById(id);
    return user ? this.toUserDTO(user) : null;
  },

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<UserDTO | null> {
    const user = await userRepository.findByEmail(email);
    return user ? this.toUserDTO(user) : null;
  },

  /**
   * Convert User model to UserDTO (remove sensitive fields)
   */
  toUserDTO(user: User): UserDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },
};
