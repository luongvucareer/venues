import { VerificationToken } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Verification token repository - handles verification token operations
 */
export const verificationTokenRepository = {
  /**
   * Create a verification token
   */
  async create(data: {
    identifier: string;
    token: string;
    expires: Date;
  }): Promise<VerificationToken> {
    return prisma.verificationToken.create({
      data,
    });
  },

  /**
   * Find token by identifier and token value
   */
  async findByToken(
    identifier: string,
    token: string
  ): Promise<VerificationToken | null> {
    return prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier,
          token,
        },
      },
    });
  },

  /**
   * Find token by token value only
   */
  async findByTokenValue(token: string): Promise<VerificationToken | null> {
    return prisma.verificationToken.findUnique({
      where: { token },
    });
  },

  /**
   * Delete a token
   */
  async delete(identifier: string, token: string): Promise<void> {
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier,
          token,
        },
      },
    });
  },

  /**
   * Delete all tokens for an identifier (email)
   */
  async deleteByIdentifier(identifier: string): Promise<void> {
    await prisma.verificationToken.deleteMany({
      where: { identifier },
    });
  },

  /**
   * Delete expired tokens
   */
  async deleteExpired(): Promise<void> {
    await prisma.verificationToken.deleteMany({
      where: {
        expires: {
          lt: new Date(),
        },
      },
    });
  },
};
