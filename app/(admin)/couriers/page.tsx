import { prisma } from "@/lib/prisma";
import { CouriersClient } from "@/components/admin/CouriersClient";
import { AddCourierModal } from "@/components/admin/AddCourierModal";
import { Truck, CheckCircle, UserX } from "lucide-react";

export default async function CouriersPage() {
  const couriers = await prisma.courier.findMany({
    include: {
      orders: {
        where: {
          status: "DELIVERED",
        },
        select: {
          deliveryFee: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalCouriers = couriers.length;
  const availableCount = couriers.filter(
    (c) => c.status === "AVAILABLE"
  ).length;
  const busyCount = couriers.filter((c) => c.status === "BUSY").length;

  return (
    <div className="flex-1 p-6 space-y-6 text-right" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20 p-4 rounded-2xl">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary italic uppercase">
            كباتن الدولي
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            إدارة أسطول الطيارين، متابعة حالاتهم، والإحصائيات المالية المباشرة.
          </p>
        </div>

        <div className="shrink-0">
          <AddCourierModal />
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <div className="p-4 bg-card border border-border rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-bold">
              إجمالي الأسطول
            </p>
            <p className="text-2xl font-black italic mt-0.5">
              {totalCouriers} كابتن
            </p>
          </div>
        </div>
        <div className="p-4 bg-card border border-border rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-bold">
              المتاحين الآن
            </p>
            <p className="text-2xl font-black italic text-emerald-600 mt-0.5">
              {availableCount}
            </p>
          </div>
        </div>
        <div className="p-4 bg-card border border-border rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600">
            <UserX className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-bold">
              في مشاوير (Busy)
            </p>
            <p className="text-2xl font-black italic text-amber-600 mt-0.5">
              {busyCount}
            </p>
          </div>
        </div>
      </div>

      <CouriersClient couriers={couriers} />
    </div>
  );
}
