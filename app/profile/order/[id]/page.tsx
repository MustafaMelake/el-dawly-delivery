"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOrderById } from "@/app/actions/order";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  Receipt,
  Truck,
  Calendar,
  User as UserIcon,
  Hash,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function OrderDetailsPage() {
  const { id } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id)
      getOrderById(id as string).then((res) => {
        setOrder(res.order);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        جاري جلب تفاصيل الأوردر...
      </div>
    );
  if (!order)
    return (
      <div className="min-h-screen flex items-center justify-center">
        الأوردر غير موجود.
      </div>
    );

  const formatDate = (date?: Date) => {
    if (!date) return "غير متوفر";
    return new Date(date).toLocaleString("ar-EG", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };
  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-[#050505] py-8 px-4"
      dir="rtl"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/profile"
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold mb-4"
        >
          <ArrowRight size={20} /> رجوع للطلبات
        </Link>

        <div className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] p-8 border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-[10px] font-black opacity-40 uppercase block mb-1">
                رقم الطلب
              </span>
              <h1 className="text-xl font-black text-primary flex items-center gap-2">
                <Hash size={18} /> {order.id.toUpperCase()}
              </h1>
            </div>
            <Badge className="bg-primary text-black rounded-full px-4 py-1 font-bold">
              {order.status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* قسم العميل */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold opacity-50 flex items-center gap-2">
                <UserIcon size={16} /> بيانات العميل
              </h3>
              <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl">
                <p className="font-black">{order.clientName}</p>
                <p className="text-sm text-slate-500">{order.clientPhone}</p>
              </div>
            </div>

            {/* قسم الشحن */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold opacity-50 flex items-center gap-2">
                <Truck size={16} /> التوصيل
              </h3>
              <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl">
                <p className="text-sm">
                  <strong>المنطقة:</strong> من {order.fromZone} إلى{" "}
                  {order.toZone}
                </p>
                <div className="mt-2 flex gap-2">
                  <MapPin size={14} className="text-primary mt-1 shrink-0" />
                  <p className="text-xs">
                    <strong>من:</strong> {order.pickupAddress}
                  </p>
                </div>
                <div className="mt-2 flex gap-2">
                  <MapPin size={14} className="text-orange-500 mt-1 shrink-0" />
                  <p className="text-xs">
                    <strong>إلى:</strong> {order.dropoffAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] p-8 border border-slate-200 dark:border-white/5 shadow-sm">
          <h3 className="text-lg font-black mb-6 flex items-center gap-2 text-green-500">
            <Receipt size={20} /> الفاتورة والماليات
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-white/5">
              <span className="text-slate-500">وصف الطلب:</span>
              <span className="font-bold">{order.description}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">سعر المنتج:</span>
              <span className="font-bold">{order.itemCost} ج.م</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">رسوم التوصيل:</span>
              <span className="font-bold text-primary">
                {order.deliveryFee} ج.م
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-primary/10 rounded-2xl mt-4">
              <span className="font-black">الإجمالي المطلوب تحصيله:</span>
              <span className="text-2xl font-black text-primary">
                {order.totalCollected} ج.م
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#0a0a0a] rounded-[2rem] p-6 border border-slate-200 dark:border-white/5 shadow-sm">
            <h3 className="text-sm font-bold opacity-50 mb-4 flex items-center gap-2">
              <Calendar size={16} /> المواعيد
            </h3>
            <ul className="space-y-3 text-xs">
              <li>
                <strong>إنشاء الطلب:</strong> {formatDate(order.createdAt)}
              </li>
              {order.assignedAt && (
                <li>
                  <strong>وقت الاستلام:</strong> {formatDate(order.assignedAt)}
                </li>
              )}
              {order.deliveredAt && (
                <li>
                  <strong>وقت التسليم:</strong> {formatDate(order.deliveredAt)}
                </li>
              )}
            </ul>
          </div>

          <div className="bg-white dark:bg-[#0a0a0a] rounded-[2rem] p-6 border border-slate-200 dark:border-white/5 shadow-sm">
            <h3 className="text-sm font-bold opacity-50 mb-4 flex items-center gap-2">
              <Truck size={16} /> بيانات الطيار
            </h3>
            {order.courier ? (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-black">
                  {order.courier.name[0]}
                </div>
                <div>
                  <p className="font-bold">{order.courier.name}</p>
                  <p className="text-xs text-slate-500">
                    {order.courier.phone}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                بانتظار تعيين طيار...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
