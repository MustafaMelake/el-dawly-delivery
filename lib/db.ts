import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient(); // لا تضع datasources هنا، Prisma ستقرأ الـ ENV تلقائياً
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const db = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
