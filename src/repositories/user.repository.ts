import { Prisma, User, UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * User repository - handles all database operations for users
 */
export const userRepository = {
  /**
   * Create a new user
   */
  async create(data: {
    email: string;
    name: string;
    password: string;
    role?: UserRole;
  }): Promise<User> {
    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
        role: data.role || "USER",
      },
    });
  },

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  },

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true },
    });
    return user !== null;
  },

  /**
   * Update user
   */
  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  /**
   * Mark email as verified
   */
  async verifyEmail(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        emailVerified: new Date(),
      },
    });
  },

  /**
   * Update password
   */
  async updatePassword(id: string, password: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { password },
    });
  },

  /**
   * Delete user
   */
  async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  },

  /**
   * Find many users with pagination
   */
  async findMany(options?: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    return prisma.user.findMany({
      skip: options?.skip,
      take: options?.take,
      where: options?.where,
      orderBy: options?.orderBy,
    });
  },

  /**
   * Count users
   */
  async count(where?: Prisma.UserWhereInput): Promise<number> {
    return prisma.user.count({ where });
  },
};
