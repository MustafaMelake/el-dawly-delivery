"use client";

import { useEffect, useState } from "react";
import { getUserOrders } from "../actions/order";
import { motion } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  User as UserIcon,
  ChevronLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default function ClientProfile() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (session) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getUserOrders().then((res: any) => {
        if (res.orders) setOrders(res.orders);
        setLoadingOrders(false);
      });
    } else if (!isPending) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoadingOrders(false);
    }
  }, [session, isPending]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold">
        جاري تحميل بروفايلك...
      </div>
    );
  }

  if (!session) {
    redirect("/track-order");
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return <CheckCircle2 className="text-green-500" size={18} />;
      case "ASSIGNED":
        return <Truck className="text-blue-500" size={18} />;
      case "PENDING":
        return <Clock className="text-orange-500" size={18} />;
      default:
        return <Package size={18} />;
    }
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      PENDING: "قيد الانتظار",
      ASSIGNED: "جاري التوصيل",
      DELIVERED: "تم الاستلام",
      CANCELLED: "ملغي",
    };
    return map[status] || status;
  };

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-[#050505] py-12 px-4"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="px-6 py-5">
          <Link
            href="/"
            className="inline-block bg-primary opacity-90 text-black px-6 py-2 rounded-xl font-bold hover:opacity-80 transition-all"
          >
            الرجوع
          </Link>
        </div>
        <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary">
            <UserIcon size={40} />
          </div>
          <div className="text-center md:text-right flex-1">
            <h1 className="text-2xl font-black italic">أهلاً بك يا بطل!</h1>
            <p className="text-slate-500 font-medium">
              هنا تقدر تتابع كل طلباتك وتحركات الشحنات.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
              <div className="text-2xl font-black text-primary">
                {orders.length}
              </div>
              <div className="text-[10px] font-bold opacity-50 uppercase">
                إجمالي الطلبات
              </div>
            </div>
          </div>
        </div>

        {/* قائمة الأوردرات */}
        <div className="space-y-4">
          <h3 className="text-xl font-black pr-2 flex items-center gap-2">
            <Package className="text-primary" /> طلباتك الأخيرة
          </h3>

          {orders.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-[#0a0a0a] rounded-[2rem] border border-dashed border-slate-300">
              <p className="text-slate-400 font-bold">
                لا توجد أوردرات مسجلة بهذا الرقم حالياً.
              </p>
            </div>
          ) : (
            orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-[#0a0a0a] p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm hover:border-primary/30 transition-all group"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className="rounded-lg px-3 py-1 bg-slate-50 dark:bg-white/5 border-none flex items-center gap-2"
                      >
                        {getStatusIcon(order.status)}
                        <span className="font-bold">
                          {getStatusText(order.status)}
                        </span>
                      </Badge>
                      <span className="text-[10px] font-bold opacity-30 italic">
                        #{order.id.slice(-6)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                        <MapPin
                          size={16}
                          className="shrink-0 mt-1 text-primary"
                        />
                        <span>
                          <strong>من:</strong> {order.pickupAddress}
                        </span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                        <MapPin
                          size={16}
                          className="shrink-0 mt-1 text-orange-500"
                        />
                        <span>
                          <strong>إلى:</strong> {order.dropoffAddress}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-48 bg-slate-50 dark:bg-white/5 rounded-[1.5rem] p-4 flex flex-col justify-center items-center gap-1 border border-slate-100 dark:border-white/5">
                    <span className="text-[10px] font-bold opacity-50 uppercase">
                      المبلغ الإجمالي
                    </span>
                    <div className="text-xl font-black text-primary">
                      {order.itemCost + order.deliveryFee}{" "}
                      <span className="text-[10px]">ج.م</span>
                    </div>
                    {order.courier && (
                      <div className="mt-2 flex items-center gap-2 text-[10px] font-bold bg-green-500/10 text-green-500 px-2 py-1 rounded-lg">
                        <Truck size={12} /> {order.courier.name}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-center">
                    <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                      <Link
                        href={`/profile/order/${order.id}`}
                        className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center hover:bg-primary transition-colors group"
                      >
                        <ChevronLeft
                          size={20}
                          className="group-hover:text-black transition-colors"
                        />
                      </Link>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
