import { trackGuestOrder } from "@/app/actions/order";
import { notFound } from "next/navigation";
import { User, Calendar, Banknote, ChevronRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await trackGuestOrder({ orderId: id });

  if (result.error || !result.success || !result.order) {
    notFound();
  }

  const order = result.order;

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-[#050505] p-6 flex flex-col items-center justify-center font-sans"
      dir="rtl"
    >
      <Link
        href="/track-order"
        className="mb-8 flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold"
      >
        <ChevronRight size={20} /> العودة للبحث
      </Link>

      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            حالة الطلب
          </h1>
          <p className="text-slate-500 font-medium">بيانات الشحنة الرسمية</p>
        </div>

        <div className="bg-white dark:bg-[#0a0a0a] border-2 border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
          <div className="space-y-8">
            {/* الحالة */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Clock size={24} />
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-bold uppercase">
                    الحالة الحالية
                  </p>
                  <p className="font-black text-lg">{order.status}</p>
                </div>
              </div>
              <Badge className="rounded-full px-4 py-1 text-xs uppercase font-black italic">
                {order.id.slice(0, 8)}
              </Badge>
            </div>

            <hr className="border-slate-100 dark:border-white/5" />

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-right">
                <User className="text-slate-300" size={20} />
                <div>
                  <p className="text-xs text-slate-400 font-bold">
                    المرسل إليه
                  </p>
                  <p className="font-bold text-xl">{order.clientName}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <Banknote className="text-slate-300" size={20} />
                <div>
                  <p className="text-xs text-slate-400 font-bold">
                    المطلوب تحصيله
                  </p>
                  <p className="font-black text-2xl text-primary italic">
                    {order.totalCollected}{" "}
                    <span className="text-sm not-italic">ج.م</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <Calendar className="text-slate-300" size={20} />
                <div>
                  <p className="text-xs text-slate-400 font-bold">
                    تاريخ إنشاء الطلب
                  </p>
                  <p className="font-bold">
                    {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
