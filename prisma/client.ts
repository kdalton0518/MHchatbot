import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  let prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = (globalThis as any).prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") (globalThis as any).prisma = prisma;
