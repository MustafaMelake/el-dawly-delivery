"use client";

import { useState } from "react";
import { Search, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-[#050505]"
      dir="rtl"
    >
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-2">
          <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary mx-auto">
            <Search size={40} />
          </div>
          <h1 className="text-3xl font-black italic">تتبع شحنتك</h1>
          <p className="text-slate-500 font-medium">
            أدخل رقم الأوردر لمتابعة حالته لحظياً
          </p>
        </div>

        <div className="relative group">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="مثال: clx123..."
            className="w-full bg-white dark:bg-[#0a0a0a] border-2 border-slate-200 dark:border-white/10 p-5 rounded-[1.8rem] pr-12 focus:border-primary outline-none transition-all font-bold text-center"
          />
          <Package
            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
        </div>

        <Button
          asChild
          className="w-full h-16 rounded-[1.8rem] font-black text-lg shadow-xl shadow-primary/20"
          disabled={!orderId}
        >
          <Link href={`/track-order/order/${orderId}`}>
            بدء التتبع <ArrowRight className="mr-2 h-5 w-5" />
          </Link>
        </Button>

        <Link
          href="/"
          className="block text-sm font-bold text-slate-400 hover:text-primary transition-colors"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
