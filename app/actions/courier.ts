"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CourierStatus } from "@prisma/client";

export async function createCourier(formData: {
  name: string;
  phone: string;
  commissionRate: number;
}) {
  try {
    const existing = await prisma.courier.findUnique({
      where: { phone: formData.phone },
    });

    if (existing) {
      return {
        success: false,
        error: "رقم الهاتف هذا مسجل لكابتن آخر بالفعل!",
      };
    }

    await prisma.courier.create({
      data: {
        name: formData.name,
        phone: formData.phone,
        commissionRate: formData.commissionRate,
        status: "OFFLINE",
      },
    });

    revalidatePath("/admin/couriers");
    return { success: true };
  } catch (error) {
    console.error("Error creating courier:", error);
    return { success: false, error: "حدث خطأ أثناء إضافة الطيار" };
  }
}

export async function updateCourierStatus(id: string, status: CourierStatus) {
  try {
    await prisma.courier.update({
      where: { id },
      data: {
        status,
        lastAvailableAt: status === "AVAILABLE" ? new Date() : undefined,
      },
    });

    revalidatePath("/admin/couriers");
    return { success: true };
  } catch (error) {
    console.error("Error updating courier status:", error);
    return { success: false, error: "فشل تحديث حالة الكابتن" };
  }
}

// 2. حذف كابتن من النظام
export async function deleteCourier(id: string) {
  try {
    // ملحوظة: لو الكابتن مرتبط بطلبات، الداتابيز ممكن تمنع الحذف بناءً على الـ Schema
    await prisma.courier.delete({
      where: { id },
    });

    revalidatePath("/admin/couriers");
    return { success: true };
  } catch (error) {
    console.error("Error deleting courier:", error);
    return {
      success: false,
      error: "لا يمكن حذف الكابتن لوجود طلبات مسجلة باسمه في النظام!",
    };
  }
}
