import { PrismaClient } from "@prisma/client";

// تعريف نوع للـ global object عشان TypeScript ميزعلش
declare global {
  var prisma: PrismaClient | undefined;
}

// لو فيه نسخة قديمة موجودة استخدمها، لو مفيش اعمل واحدة جديدة
export const db = globalThis.prisma || new PrismaClient();

// لو إحنا مش في الـ Production، احفظ النسخة دي في الـ global object
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
