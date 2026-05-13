"use client";

import React from "react";
import { motion } from "framer-motion";
import { Phone, MessageCircle, MapPin, Send, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const contactSchema = z.object({
  name: z.string().min(3, "الاسم مطلوب"),
  phone: z.string().min(11, "رقم الموبايل غير صحيح"),
  message: z.string().min(5, "اكتب استفسارك"),
});

export default function ContactSection() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    console.log("Contact Data:", data);
  };

  return (
    <section
      id="contact"
      dir="rtl"
      className="py-24 px-6 md:px-12 bg-white dark:bg-background"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-12">
            <div className="space-y-4">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
              >
                تواصل معانا
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black text-foreground leading-none"
              >
                نتكلم؟ <br />
                <span className="text-primary">إحنا جاهزين.</span>
              </motion.h2>
              <p className="text-muted-foreground text-lg max-w-md">
                عندك استفسار عن سعر مشوار؟ حابب تتعاقد مع المكتب؟ كلمنا دلوقتي
                وهنرد عليك فوراً.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.a
                href="tel:0123456789" 
                whileHover={{ y: -5 }}
                className="p-6 bg-secondary rounded-3xl border border-border flex flex-col gap-4 group"
              >
                <div className="w-12 h-12 bg-white dark:bg-muted rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase">
                    اتصل بنا
                  </p>
                  <p className="text-xl font-bold">0123 456 7890</p>
                </div>
              </motion.a>

              <motion.a
                href="https://wa.me/20123456789"
                whileHover={{ y: -5 }}
                className="p-6 bg-secondary rounded-3xl border border-border flex flex-col gap-4 group"
              >
                <div className="w-12 h-12 bg-white dark:bg-muted rounded-2xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase">
                    واتساب
                  </p>
                  <p className="text-xl font-bold">راسلنا فوراً</p>
                </div>
              </motion.a>
            </div>

            <div className="space-y-6 pt-6">
              <div className="flex items-center gap-4">
                <MapPin className="text-primary w-5 h-5" />
                <p className="font-bold">منوف، شارع المحطة - المنوفية</p>
              </div>
              <div className="flex items-center gap-4">
                <Clock className="text-primary w-5 h-5" />
                <p className="font-bold">متاحين ٢٤ ساعة / ٧ أيام</p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-[#1a1a1a] p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-black/20 text-white"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold opacity-70 px-2">
                  الاسم بالكامل*
                </label>
                <input
                  {...register("name")}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-primary focus:outline-none transition-colors"
                  placeholder="اسمك الكريم"
                />
                {errors.name && (
                  <p className="text-red-400 text-xs">
                    {errors.name.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold opacity-70 px-2">
                  رقم الموبايل*
                </label>
                <input
                  {...register("phone")}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-primary focus:outline-none transition-colors"
                  placeholder="01xxxxxxxxx"
                />
                {errors.phone && (
                  <p className="text-red-400 text-xs">
                    {errors.phone.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold opacity-70 px-2">
                  رسالتك أو استفسارك*
                </label>
                <textarea
                  {...register("message")}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-primary focus:outline-none transition-colors resize-none"
                  placeholder="حابب تسأل عن إيه؟"
                />
                {errors.message && (
                  <p className="text-red-400 text-xs">
                    {errors.message.message as string}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20"
              >
                <span>إرسال الاستفسار</span>
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
