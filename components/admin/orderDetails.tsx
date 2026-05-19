"use client";

import React from "react";
import { Order, Courier, OrderStatus, Zone } from "@prisma/client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Receipt,
  Truck,
  Calendar,
  User as UserIcon,
  Hash,
} from "lucide-react";

type OrderWithCourier = Order & { courier: Courier | null };

interface OrderDetailsModalProps {
  order: OrderWithCourier | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusMap: Record<OrderStatus, string> = {
  PENDING: "قيد الانتظار",
  ASSIGNED: "تم التعيين",
  DELIVERED: "تم التسليم",
  CANCELLED: "ملغي",
};

const zoneMap: Record<Zone, string> = {
  MENOUF: "منوف",
  SERS: "سرِس",
  BERHEEM: "برهيم",
};

export function OrderDetailsModal({
  order,
  isOpen,
  onClose,
}: OrderDetailsModalProps) {
  if (!order) return null;

  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleString("ar-EG", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* التعديل الأهم هنا: 
        استخدام !max-w-5xl و !w-[95vw] لكسر قيود shadcn 
      */}
      <DialogContent
        className="!w-[95vw] !max-w-5xl bg-slate-50 dark:bg-zinc-950 p-0 border-none rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        dir="rtl"
        style={{ maxHeight: "90vh" }}
      >
        <DialogTitle className="sr-only">
          تفاصيل الطلب رقم {order.id}
        </DialogTitle>

        {/* الهيدر الثابت من فوق */}
        <div className="bg-white dark:bg-zinc-900 px-6 py-5 border-b border-slate-200 dark:border-white/5 flex justify-between items-center z-10">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-500 mb-1">
              رقم الطلب
            </span>
            {/* break-all بتمنع النص الطويل إنه يبوظ التصميم */}
            <h1 className="text-lg md:text-xl font-black text-primary flex items-center gap-2 break-all">
              <Hash size={20} className="shrink-0" />
              {order.id.toUpperCase()}
            </h1>
          </div>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none rounded-full px-4 py-2 text-sm font-bold shrink-0">
            {statusMap[order.status]}
          </Badge>
        </div>

        {/* المحتوى القابل للتمرير */}
        <div className="overflow-y-auto custom-scrollbar p-6 space-y-6">
          {/* تقسيم الشاشة لعمودين على الشاشات الكبيرة */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* العمود الأيمن: بيانات العميل والتوصيل */}
            <div className="space-y-6">
              {/* كارت بيانات العميل */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200 dark:border-white/5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-500 mb-4 flex items-center gap-2">
                  <UserIcon size={18} /> بيانات العميل
                </h3>
                <div className="space-y-1">
                  <p className="font-bold text-lg text-slate-900 dark:text-slate-100">
                    {order.clientName}
                  </p>
                  <p className="text-slate-500 font-mono" dir="ltr text-right">
                    {order.clientPhone}
                  </p>
                </div>
              </div>

              {/* كارت التوصيل */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200 dark:border-white/5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-500 mb-4 flex items-center gap-2">
                  <MapPin size={18} /> مسار التوصيل
                </h3>
                <div className="relative pl-4 space-y-4 before:absolute before:right-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  <div className="relative z-10 flex gap-3">
                    <div className="w-3.5 h-3.5 rounded-full bg-slate-300 dark:bg-slate-700 mt-1 shrink-0" />
                    <div>
                      <p className="font-bold text-sm">
                        من: {zoneMap[order.fromZone]}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {order.pickupAddress || "لا يوجد عنوان تفصيلي"}
                      </p>
                    </div>
                  </div>
                  <div className="relative z-10 flex gap-3">
                    <div className="w-3.5 h-3.5 rounded-full bg-primary mt-1 shrink-0 shadow-[0_0_0_4px_rgba(var(--primary),0.2)]" />
                    <div>
                      <p className="font-bold text-sm">
                        إلى: {zoneMap[order.toZone]}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {order.dropoffAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* العمود الأيسر: الماليات والمواعيد */}
            <div className="space-y-6">
              {/* كارت الماليات */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200 dark:border-white/5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-500 mb-4 flex items-center gap-2">
                  <Receipt size={18} /> تفاصيل الدفع
                </h3>

                {order.description && (
                  <div className="mb-4 pb-4 border-b border-slate-100 dark:border-white/5">
                    <p className="text-xs text-slate-500 mb-1">وصف الطلب:</p>
                    <p className="text-sm font-medium">{order.description}</p>
                  </div>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">سعر المنتج</span>
                    <span className="font-bold">{order.itemCost} ج.م</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">رسوم التوصيل</span>
                    <span className="font-bold text-primary">
                      +{order.deliveryFee} ج.م
                    </span>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
                    <span className="font-bold text-slate-900 dark:text-white">
                      الإجمالي المطلوب
                    </span>
                    <span className="text-xl font-black text-primary bg-primary/10 px-3 py-1 rounded-lg">
                      {order.totalCollected} ج.م
                    </span>
                  </div>
                </div>
              </div>

              {/* كارت المندوب */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200 dark:border-white/5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-500 mb-4 flex items-center gap-2">
                  <Truck size={18} /> بيانات الكابتن
                </h3>
                {order.courier ? (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-lg font-bold text-slate-700 dark:text-slate-300 shrink-0">
                      {order.courier.name.substring(0, 2)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {order.courier.name}
                      </p>
                      <p
                        className="text-sm text-slate-500 font-mono mt-0.5"
                        dir="ltr"
                      >
                        {order.courier.phone}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-center border border-dashed border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-500">
                      لم يتم تعيين كابتن حتى الآن
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* شريط المواعيد بالأسفل (يأخذ العرض بالكامل) */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-slate-200 dark:border-white/5 shadow-sm flex flex-wrap gap-4 justify-between items-center text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Calendar size={16} />
              <span>
                أنشئ في:{" "}
                <strong className="text-slate-900 dark:text-white">
                  {formatDate(order.createdAt)}
                </strong>
              </span>
            </div>
            {order.deliveredAt && (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <span>
                  سُلم في: <strong>{formatDate(order.deliveredAt)}</strong>
                </span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
