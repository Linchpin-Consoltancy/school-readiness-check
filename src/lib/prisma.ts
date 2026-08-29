import { PrismaClient } from "@prisma/client";

// Next.js reloads modules in development, which would otherwise open a new
// database connection on every edit. Reusing one client avoids that.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
