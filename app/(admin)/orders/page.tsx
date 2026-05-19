// src/app/admin/orders/page.tsx
import { prisma } from "@/lib/prisma";
import { OrdersClient } from "../../../components/admin/orders-client";

export default async function OrdersPage() {
  const [orders, couriers] = await Promise.all([
    prisma.order.findMany({
      include: {
        courier: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.courier.findMany({
      where: {
        status: { in: ["AVAILABLE", "BUSY"] },
      },
    }),
  ]);

  return (
    <div className="flex-1 p-6 space-y-6 text-right" dir="rtl">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-primary italic uppercase">
          إدارة شحنات الدولي
        </h1>
        <p className="text-muted-foreground font-medium mt-1">
          متابعة حالات الطرود وتعيين الكباتن لخطوط السير.
        </p>
      </div>

      <OrdersClient initialOrders={orders} couriers={couriers} />
    </div>
  );
}
