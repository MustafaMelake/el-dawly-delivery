// src/app/admin/page.tsx
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Wallet, Clock, Truck, Banknote } from "lucide-react";
import { RevenueChart } from "@/components/admin/RevenueChart";

export default async function AdminDashboard() {
  const [
    revenueResult,
    pendingOrdersCount,
    availableCouriersCount,
    cashHandledResult,
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: { deliveryFee: true },
      where: { status: "DELIVERED" },
    }),

    prisma.order.count({
      where: { status: "PENDING" },
    }),

    prisma.courier.count({
      where: { status: "AVAILABLE" },
    }),

    prisma.order.aggregate({
      _sum: { totalCollected: true },
      where: { status: "DELIVERED" },
    }),
  ]);

  const rawOrders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
      },
      status: "DELIVERED",
    },
    select: { deliveryFee: true, createdAt: true },
  });

  const totalRevenue = revenueResult._sum.deliveryFee || 0;
  const totalCashHandled = cashHandledResult._sum.totalCollected || 0;

  return (
    <div className="flex-1 space-y-6 p-6 pt-2" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-primary uppercase italic">
            مركز عمليات الدولي
          </h2>
          <p className="text-muted-foreground font-medium mt-1">
            نظرة شاملة على أداء عمليات الشحن والتحصيل.
          </p>
        </div>
      </div>

      {/* الـ KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 text-right">
        <StatsCard
          title="أرباح التوصيل (Revenue)"
          value={`${totalRevenue.toLocaleString()} ج.م`}
          icon={<Wallet className="h-5 w-5 text-emerald-500" />}
          description="إجمالي رسوم الشحن (الطلبات المسلمة)"
        />

        <StatsCard
          title="الطلبات المعلقة"
          value={pendingOrdersCount}
          icon={<Clock className="h-5 w-5 text-orange-500" />}
          description="طلبات بانتظار التعيين"
          trend={pendingOrdersCount > 10 ? "يحتاج تدخل سريع" : "الوضع مستقر"}
          trendColor={
            pendingOrdersCount > 10 ? "text-red-500" : "text-emerald-500"
          }
        />

        <StatsCard
          title="الطيارين المتاحين"
          value={availableCouriersCount}
          icon={<Truck className="h-5 w-5 text-blue-500" />}
          description="جاهزين لاستلام أوردرات فوراً"
        />

        <StatsCard
          title="إجمالي النقدية المحصلة"
          value={`${totalCashHandled.toLocaleString()} ج.م`}
          icon={<Banknote className="h-5 w-5 text-violet-500" />}
          description="عهدة تم تحصيلها بنجاح"
        />
      </div>

      {/* الـ Full Width Chart */}
      <div className="grid gap-4 grid-cols-1">
        <Card className="shadow-sm border-slate-200 dark:border-white/5 overflow-hidden rounded-[2rem]">
          <CardHeader className="bg-slate-50/50 dark:bg-[#0a0a0a] text-right">
            <CardTitle className="text-2xl font-black text-slate-800 dark:text-slate-100 italic">
              تحليل أرباح التوصيل
            </CardTitle>
            <CardDescription className="font-medium text-sm">
              رسم بياني يوضح رسوم التوصيل المحصلة خلال الـ 6 أشهر الماضية.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[450px]">
              {/* تأكد إن الـ RevenueChart بياخد prop اسمه orders وفيه deliveryFee بدل totalAmount */}
              <RevenueChart orders={rawOrders} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// StatsCard Component
function StatsCard({
  title,
  value,
  icon,
  description,
  trend,
  trendColor = "text-red-500",
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  trend?: string;
  trendColor?: string;
}) {
  return (
    <Card className="hover:border-primary/50 transition-all duration-300 shadow-sm rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="p-2 bg-slate-50 dark:bg-white/5 rounded-xl">{icon}</div>
        <CardTitle className="text-sm font-bold text-slate-600 dark:text-slate-300">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black italic">{value}</div>
        <p className="text-xs text-muted-foreground mt-2 font-medium">
          {description}
        </p>
        {trend && (
          <span
            className={`text-xs font-bold ${trendColor} mt-2 block bg-slate-50 dark:bg-white/5 w-fit px-2 py-1 rounded-md`}
          >
            {trend}
          </span>
        )}
      </CardContent>
    </Card>
  );
}
