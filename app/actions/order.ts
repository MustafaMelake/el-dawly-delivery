"use server";

import { auth } from "@/lib/auth";
import { orderSchema, trackOrderSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { OrderStatus } from "@prisma/client";

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
  } catch (error) {
    console.error("Error creating order:", error);
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

    // 🚨 تم تصحيح اللوجيك هنا لمنع أي حد غريب يشوف الأوردر
    const isOwner = session?.user?.id === order.userId;
    const isGuest = !order.userId;

    // لو هو مش صاحب الأوردر، والأوردر ده مش بتاع زائر (guest)، امنعه!
    // (هتحتاج تراجع البزنس لوجيك بتاعك هنا لو الأدمن محتاج يشوفه)
    if (!isOwner && !isGuest && session?.user?.role !== "ADMIN") {
      return { error: "غير مصرح لك بمشاهدة هذا الطلب" };
    }

    return { order };
  } catch (error) {
    console.error("Error fetching order by ID:", error);
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
        // 💡 ممتاز إنك استخدمت select هنا عشان متسربش بيانات للعميل
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

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    // 💡 استخدام Transaction هنا مهم جداً!
    // لو الأوردر اتحدث وحصل مشكلة في السيرفر قبل ما نحدث حالة الطيار، الطيار هيفضل "مشغول" للأبد!
    // الـ Transaction بيضمن إن العمليتين يتموا مع بعض، أو يتلغوا مع بعض.
    await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status },
      });

      if (
        (status === "DELIVERED" || status === "CANCELLED") &&
        updatedOrder.courierId
      ) {
        await tx.courier.update({
          where: { id: updatedOrder.courierId },
          data: { status: "AVAILABLE" },
        });
      }
    });

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return {
      success: false,
      error: "حدث خطأ غير متوقع أثناء تحديث حالة الطلب",
    };
  }
}

export async function assignCourierToOrder(orderId: string, courierId: string) {
  try {
    // 💡 ممتاز! استخدامك للـ Transaction هنا كان بيرفكت.
    await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: {
          courierId: courierId,
          status: "ASSIGNED",
          assignedAt: new Date(),
        },
      }),
      prisma.courier.update({
        where: { id: courierId },
        data: { status: "BUSY" },
      }),
    ]);

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Failed to assign courier:", error);
    return { success: false, error: "حدث خطأ أثناء تعيين الطيار" };
  }
}
