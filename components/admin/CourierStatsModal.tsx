"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, DollarSign, Coins } from "lucide-react";

type OrderData = { deliveryFee: number; createdAt: Date };
type CourierData = {
  name: string;
  commissionRate?: number | null;
  orders: OrderData[];
};

interface CourierStatsModalProps {
  courier: CourierData | null;
  onClose: () => void;
}

export function CourierStatsModal({
  courier,
  onClose,
}: CourierStatsModalProps) {
  if (!courier) return null;

  // دالة الحسابات الذكية المطورة
  const calculateStats = (orders: OrderData[], commissionRate: number = 80) => {
    const now = new Date();
    let dailyRevenue = 0,
      dailyCount = 0;
    let monthlyRevenue = 0,
      monthlyCount = 0;
    let allTimeRevenue = 0,
      allTimeCount = 0;

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const fee = order.deliveryFee;

      allTimeRevenue += fee;
      allTimeCount++;

      if (
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      ) {
        monthlyRevenue += fee;
        monthlyCount++;

        if (orderDate.getDate() === now.getDate()) {
          dailyRevenue += fee;
          dailyCount++;
        }
      }
    });

    const rate = commissionRate / 100;

    return {
      daily: {
        count: dailyCount,
        courierProfit: dailyRevenue * rate,
        officeProfit: dailyRevenue * (1 - rate),
      },
      monthly: {
        count: monthlyCount,
        total: monthlyRevenue,
        courierProfit: monthlyRevenue * rate,
        officeProfit: monthlyRevenue * (1 - rate),
      },
      allTime: {
        count: allTimeCount,
        total: allTimeRevenue,
        courierProfit: allTimeRevenue * rate,
        officeProfit: allTimeRevenue * (1 - rate),
      },
    };
  };

  const stats = calculateStats(courier.orders, courier.commissionRate || 80);

  return (
    <Dialog open={!!courier} onOpenChange={(open) => !open && onClose()}>
      {/* التعديل الجذري هنا:
        جعلنا العرض مرن وواسع !w-[95vw] والحد الأقصى !max-w-5xl لكسر قيود المقاسات الافتراضية
      */}
      <DialogContent
        className="!w-[95vw] !max-w-5xl bg-slate-50 dark:bg-zinc-950 p-0 border-none rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        dir="rtl"
        style={{ maxHeight: "90vh" }}
      >
        {/* أضفنا DialogTitle مخفي لـ Accessibility بدلاً من DialogHeader التقليدي لتوفير مساحة أنظف */}
        <DialogTitle className="sr-only">
          تقارير حسابات الكابتن {courier.name}
        </DialogTitle>

        {/* هيدر ثابت علوي مريح للعين */}
        <div className="bg-white dark:bg-zinc-900 px-6 py-5 border-b border-slate-200 dark:border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 block">
                كشف الحساب المالي
              </span>
              <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
                تقارير حسابات الكابتن: {courier.name}
              </h2>
            </div>
          </div>
          <Badge className="bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 border-none rounded-full px-4 py-2 text-xs font-bold">
            نسبة العموله: {courier.commissionRate || 80}%
          </Badge>
        </div>

        {/* مساحة المحتوى مقسمة بريد أوتوماتيكي بناءً على حجم الشاشة */}
        <div className="overflow-y-auto custom-scrollbar p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1️⃣ إحصائيات اليوم */}
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-foreground mb-4">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <h3 className="font-bold text-base">إحصائيات اليوم</h3>
                  <Badge className="mr-auto font-black bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-none">
                    {stats.daily.count} أوردر
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 dark:bg-zinc-950 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                    <p className="text-[10px] font-bold text-slate-400 mb-1">
                      مكسب الكابتن
                    </p>
                    <p className="text-base font-black text-emerald-600">
                      {stats.daily.courierProfit.toFixed(0)}{" "}
                      <span className="text-xs">ج.م</span>
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-zinc-950 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                    <p className="text-[10px] font-bold text-slate-400 mb-1">
                      ربح المكتب
                    </p>
                    <p className="text-base font-black text-primary">
                      {stats.daily.officeProfit.toFixed(0)}{" "}
                      <span className="text-xs">ج.م</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2️⃣ إحصائيات الشهر */}
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-foreground mb-4">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <h3 className="font-bold text-base">إحصائيات الشهر الجاري</h3>
                  <Badge className="mr-auto font-black bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 border-none">
                    {stats.monthly.count} أوردر
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 dark:bg-zinc-950 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                    <p className="text-[10px] font-bold text-slate-400 mb-1">
                      إجمالي مكسبه
                    </p>
                    <p className="text-base font-black text-emerald-600">
                      {stats.monthly.courierProfit.toFixed(0)}{" "}
                      <span className="text-xs">ج.م</span>
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-zinc-950 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                    <p className="text-[10px] font-bold text-slate-400 mb-1">
                      إجمالي ربح المكتب
                    </p>
                    <p className="text-base font-black text-primary">
                      {stats.monthly.officeProfit.toFixed(0)}{" "}
                      <span className="text-xs">ج.m</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex justify-between items-center text-xs">
                <span className="font-bold text-slate-400">
                  رسوم توصيل الشهر:
                </span>
                <span className="font-black text-slate-700 dark:text-slate-300">
                  {stats.monthly.total} ج.م
                </span>
              </div>
            </div>

            {/* 3️⃣ إجمالي الخدمة بالكامل (All-Time) */}
            <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10 shadow-sm flex flex-col justify-between md:col-span-2 lg:col-span-1">
              <div>
                <div className="flex items-center gap-2 text-foreground mb-4">
                  <Coins className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-base text-primary">
                    إجمالي مسيرة العمل
                  </h3>
                  <Badge className="mr-auto font-black bg-primary text-black hover:bg-primary/90 border-none">
                    {stats.allTime.count} أوردر
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-slate-200 dark:border-white/5">
                    <p className="text-[10px] font-bold text-slate-400 mb-1">
                      مجموع أرباح الكابتن
                    </p>
                    <p className="text-base font-black text-emerald-600">
                      {stats.allTime.courierProfit.toFixed(0)}{" "}
                      <span className="text-xs">ج.م</span>
                    </p>
                  </div>
                  <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-slate-200 dark:border-white/5">
                    <p className="text-[10px] font-bold text-slate-400 mb-1">
                      مجموع أرباح المكتب
                    </p>
                    <p className="text-base font-black text-primary">
                      {stats.allTime.officeProfit.toFixed(0)}{" "}
                      <span className="text-xs">ج.م</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-primary/10 flex justify-between items-center text-xs">
                <span className="font-bold text-primary/70">
                  إجمالي التداولات الكلية:
                </span>
                <span className="font-black text-primary text-sm">
                  {stats.allTime.total} ج.م
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
