"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  MapPin,
  User,
  ShoppingBag,
  ArrowLeftRight,
  AlertCircle,
  Wallet,
  Search,
  Copy,
  PackageCheck,
} from "lucide-react";
import { orderSchema, type OrderValues } from "@/lib/validators";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createOrder } from "../actions/order";
import Link from "next/link";
import { useState } from "react";

export default function OrderForm() {
  const [orderId, setOrderId] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrderValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      clientName: "",
      clientPhone: "",
      description: "",
      pickupAddress: "",
      dropoffAddress: "",
      fromZone: "MENOUF",
      toZone: "MENOUF",
      itemCost: 0,
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedFrom = watch("fromZone");
  const selectedTo = watch("toZone");
  const itemCostValue = watch("itemCost") || 0;

  const deliveryFee =
    selectedFrom === "MENOUF" && selectedTo === "MENOUF" ? 20 : 50;
  const totalAmount = Number(itemCostValue) + deliveryFee;

  const onSubmit: SubmitHandler<OrderValues> = async (values) => {
    try {
      const result = await createOrder(values);

      if (result.error) {
        alert("❌ خطأ: " + result.error);
        return;
      }

      if (result.id) {
        setOrderId(result.id);
        reset();
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("⚠️ حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى");
    }
  };

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    alert("تم نسخ رقم الطلب! ✅");
  };
  if (orderId) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#050505]"
        dir="rtl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-[#0a0a0a] p-10 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-2xl text-center space-y-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              damping: 12,
              stiffness: 200,
              delay: 0.2,
            }}
            className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto shadow-lg shadow-primary/30"
          >
            <PackageCheck size={48} className="text-black" />
          </motion.div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black italic">طلبك وصل يا بطل!</h2>
            <p className="text-slate-500 font-medium">
              أوردرك دلوقتي في الحفظ والصون وجاري تجهيزه.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">
              رقم التتبع (اضغط للنسخ)
            </p>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => copyToClipboard(orderId)}
              className="group relative cursor-pointer bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 p-6 rounded-[2rem] transition-all hover:border-primary/50"
            >
              <code className="text-2xl font-black text-primary tracking-tighter">
                {orderId.toUpperCase()}
              </code>
              <div className="absolute inset-y-0 left-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Copy size={18} className="text-primary" />
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-4">
            <Link
              href={`/profile/order/${orderId}`}
              className="flex items-center justify-center gap-2 w-full h-14 bg-black dark:bg-white dark:text-black text-white rounded-2xl font-bold hover:opacity-90 transition-all"
            >
              <Search size={18} /> تتبع الطلب الآن
            </Link>
            <button
              onClick={() => setOrderId(null)}
              className="flex items-center justify-center gap-2 w-full h-14 bg-slate-100 dark:bg-white/5 rounded-2xl font-bold hover:bg-primary hover:text-black transition-all"
            >
              عمل أوردر جديد
            </button>
            <Link
              href="/"
              className="text-sm font-bold opacity-40 hover:opacity-100 transition-opacity pt-2"
            >
              العودة للرئيسية
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-12 px-4 bg-slate-50 dark:bg-[#050505]"
      dir="rtl"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <div className="px-6 py-5">
          <Link
            href="/"
            className="inline-block bg-primary opacity-90 text-black px-6 py-2 rounded-xl font-bold hover:opacity-80 transition-all"
          >
            الرجوع
          </Link>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                  <User size={20} />
                </div>
                <h3 className="text-lg font-black italic">بيانات العميل</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Input
                    {...register("clientName")}
                    placeholder="اسم العميل المستلم"
                    className="bg-slate-50 dark:bg-white/5 border-none h-12 rounded-xl"
                  />
                  {errors.clientName && (
                    <p className="text-red-500 text-[10px] pr-2">
                      {errors.clientName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Input
                    {...register("clientPhone")}
                    placeholder="رقم الموبايل"
                    className="bg-slate-50 dark:bg-white/5 border-none h-12 rounded-xl"
                  />
                  {errors.clientPhone && (
                    <p className="text-red-500 text-[10px] pr-2">
                      {errors.clientPhone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500">
                  <ShoppingBag size={20} />
                </div>
                <h3 className="text-lg font-black italic">محتوى الشحنة</h3>
              </div>
              <Textarea
                {...register("description")}
                placeholder="ماذا يوجد داخل الطرد؟"
                className="bg-slate-50 dark:bg-white/5 border-none min-h-[100px] rounded-2xl resize-none"
              />
              {errors.description && (
                <p className="text-red-500 text-[10px] pr-2 mt-2">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <MapPin size={20} />
                </div>
                <h3 className="text-lg font-black italic">تفاصيل العناوين</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <Input
                    {...register("pickupAddress")}
                    placeholder="عنوان الاستلام بالتفصيل"
                    className="bg-slate-50 dark:bg-white/5 border-none h-12 rounded-xl"
                  />
                  {errors.pickupAddress && (
                    <p className="text-red-500 text-[10px] pr-2 mt-1">
                      {errors.pickupAddress.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    {...register("dropoffAddress")}
                    placeholder="عنوان التوصيل بالتفصيل"
                    className="bg-slate-50 dark:bg-white/5 border-none h-12 rounded-xl"
                  />
                  {errors.dropoffAddress && (
                    <p className="text-red-500 text-[10px] pr-2 mt-1">
                      {errors.dropoffAddress.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0a0a0a] text-white p-8 rounded-[2.5rem] sticky top-6 border border-white/5 shadow-2xl">
              <h3 className="text-xl font-black mb-8 flex items-center gap-2 text-primary">
                <ArrowLeftRight className="w-5 h-5" /> ملخص الرحلة
              </h3>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase opacity-50 font-bold">
                    من منطقة
                  </label>
                  <select
                    {...register("fromZone")}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-primary font-bold"
                  >
                    <option value="MENOUF" className="text-black">
                      منوف
                    </option>
                    <option value="SERS" className="text-black">
                      سرس الليان
                    </option>
                    <option value="BERHEEM" className="text-black">
                      برهيم
                    </option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase opacity-50 font-bold">
                    إلى منطقة
                  </label>
                  <select
                    {...register("toZone")}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-primary font-bold"
                  >
                    <option value="MENOUF" className="text-black">
                      منوف
                    </option>
                    <option value="SERS" className="text-black">
                      سرس الليان
                    </option>
                    <option value="BERHEEM" className="text-black">
                      برهيم
                    </option>
                  </select>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex justify-between items-center my-6">
                  <span className="text-xs font-bold opacity-70">
                    سعر الشحن
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-primary">
                      {deliveryFee}
                    </span>
                    <span className="text-[10px] font-bold text-primary italic">
                      ج.م
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase opacity-50 font-bold">
                      ثمن الأوردر (COD)
                    </label>
                    <div className="relative">
                      <Input
                        {...register("itemCost")}
                        type="number"
                        className="bg-white/5 border-none h-14 text-center text-2xl font-black rounded-2xl"
                        placeholder="0"
                      />
                      <Wallet className="absolute left-4 top-4 w-5 h-5 opacity-20" />
                    </div>
                    {errors.itemCost && (
                      <p className="text-red-500 text-[10px] text-center">
                        {errors.itemCost.message}
                      </p>
                    )}
                  </div>

                  <div className="p-4 bg-primary rounded-2xl text-black flex justify-between items-center">
                    <span className="text-xs font-black uppercase">
                      المبلغ المطلوب تحصيله
                    </span>
                    <span className="text-2xl font-black">
                      {totalAmount} ج.م
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-yellow-500 shrink-0" />
                  <p className="text-[9px] text-yellow-500/80 leading-relaxed font-bold">
                    تنبيه: أي تغيير في مسار الرحلة أو تفاصيل الأوردر بعد تأكيد
                    الطلب، سيؤدي لتغيير سعر الشحن آلياً حسب المسار الجديد.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-16 bg-primary hover:bg-primary/90 text-black font-black rounded-[2rem] text-lg shadow-xl shadow-primary/10 transition-transform active:scale-95"
                >
                  {isSubmitting ? "جاري الحفظ..." : "تأكيد الطلب الآن"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
