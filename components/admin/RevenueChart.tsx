/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  Bar,
  ComposedChart,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

interface RevenueChartProps {
  orders: {
    deliveryFee: number;
    createdAt: Date;
  }[];
}

export function RevenueChart({ orders }: RevenueChartProps) {
  const chartData = useMemo(() => {
    const months: {
      name: string;
      fullMonth: string;
      year: number;
      revenue: number;
      orderCount: number;
    }[] = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        name: d.toLocaleString("ar-EG", { month: "short" }),
        fullMonth: d.toLocaleString("ar-EG", { month: "long" }),
        year: d.getFullYear(),
        revenue: 0,
        orderCount: 0,
      });
    }

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const monthName = date.toLocaleString("ar-EG", { month: "short" });
      const year = date.getFullYear();

      const monthEntry = months.find(
        (m) => m.name === monthName && m.year === year
      );

      if (monthEntry) {
        monthEntry.revenue += order.deliveryFee;
        monthEntry.orderCount += 1;
      }
    });

    return months;
  }, [orders]);

  return (
    <Card
      className="col-span-4 shadow-sm border-border bg-card/50 backdrop-blur-xl text-right"
      dir="rtl"
    >
      <CardContent className="pt-6">
        <div className="h-[350px] w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: -10, left: -20, bottom: 0 }}
            >
              {/* تعريف التدرج اللوني المعتمد على الأخضر الأساسي للبراند */}
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--primary)"
                    stopOpacity={0.25}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--primary)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              {/* شبكة الخلفية متناغمة مع حدود السيستم */}
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                fontSize={12}
                tick={{ fill: "var(--muted-foreground)", fontWeight: 600 }}
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                fontSize={12}
                tick={{ fill: "var(--muted-foreground)", fontWeight: 600 }}
                tickFormatter={(value) => `${value} ج.م`}
                orientation="right" // نقل المحور لليمين ليناسب الـ RTL
              />

              {/* تخصيص الـ المؤشر ليتوافق مع لون الـ Accent المائي */}
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "var(--accent)" }}
              />

              {/* أعمدة شفافة لعدد الأوردرات بالخلفية مستوحاة من الموتد */}
              <Bar
                dataKey="orderCount"
                fill="var(--primary)"
                opacity={0.12}
                barSize={28}
                radius={[6, 6, 0, 0]}
              />

              {/* منحنى الإيرادات الانسيابي بلون البراند الأخضر الأساسي */}
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--primary)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#revenueGradient)"
                activeDot={{
                  r: 6,
                  stroke: "var(--card)",
                  strokeWidth: 2,
                  fill: "var(--primary)",
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// مكون الـ Tooltip المخصص الاحترافي متوافق كلياً مع الـ Dark Mode ومتغيرات الألوان
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const revenue =
      payload.find((p: any) => p.dataKey === "revenue")?.value || 0;
    const count =
      payload.find((p: any) => p.dataKey === "orderCount")?.value || 0;

    return (
      <div
        className="rounded-xl border border-border bg-card p-3 shadow-md text-right"
        dir="rtl"
      >
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-black text-muted-foreground">
            إحصائيات شحن {label}
          </span>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
              <span className="text-sm font-black text-foreground">
                {new Intl.NumberFormat("ar-EG", {
                  style: "currency",
                  currency: "EGP",
                  maximumFractionDigits: 0,
                }).format(revenue)}
              </span>
            </div>
            <div className="flex items-center gap-2 mr-0.5">
              <div className="h-2 w-2 rounded-full bg-[var(--muted-foreground)] opacity-60" />
              <span className="text-xs font-bold text-muted-foreground">
                {count} شحنة مكتملة
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
