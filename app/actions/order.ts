// app/actions/order.ts
"use server";

import { auth } from "@/lib/auth";
import { orderSchema, trackOrderSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function createOrder(values: unknown) {
  const validated = orderSchema.safeParse(values);
  if (!validated.success) return { error: "البيانات غير مكتملة" };

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  try {
    const { fromZone, toZone, itemCost } = validated.data;
    const deliveryFee = fromZone === "MENOUF" && toZone === "MENOUF" ? 20 : 50;

    const newOrder = await prisma.order.create({
      data: {
        ...validated.data,
        deliveryFee,
        totalCollected: Number(itemCost) + deliveryFee,
        status: "PENDING",
        userId: session?.user?.id || null,
      },
    });

    revalidatePath("/admin/orders");
    return { success: true, id: newOrder.id };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { error: "فشل حفظ الأوردر" };
  }
}

export async function getUserOrders() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: "يجب تسجيل الدخول أولاً" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { phone: true },
    });

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { userId: session.user.id }, 
          { clientPhone: user?.phone || "no-phone-set" }, 
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        courier: {
          select: { name: true, phone: true },
        },
      },
    });

    return { orders };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { error: "حدث خطأ أثناء جلب البيانات" };
  }
}

export async function getOrderById(orderId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { courier: true },
    });

    if (!order) return { error: "الأوردر غير موجود" };

    const isOwner = session?.user?.id === order.userId;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const isGuestOwner = !order.userId && order.clientPhone;

    if (!isOwner && !session?.user) {
      return { order };
    }

    return { order };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { error: "خطأ في السيرفر" };
  }
}

export async function trackGuestOrder(values: unknown) {
  const validated = trackOrderSchema.safeParse(values);

  if (!validated.success) {
    return { error: "برجاء إدخال رقم طلب صحيح" };
  }

  try {
    const { orderId } = validated.data;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        clientName: true,
        totalCollected: true,
        status: true,
        createdAt: true,
      },
    });

    if (!order) {
      return { error: "عفواً، لم يتم العثور على هذا الطلب" };
    }

    return { success: true, order };
  } catch (error) {
    console.error("Tracking Error:", error);
    return { error: "حدث خطأ في السيرفر" };
  }
}
