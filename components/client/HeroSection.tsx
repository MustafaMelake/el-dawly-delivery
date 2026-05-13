"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Navigation,
  Star,
  Circle,
  Check,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      dir="rtl"
      className="min-h-screen bg-background text-foreground p-4 md:p-8 font-sans overflow-hidden"
    >
      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto bg-[#e5ead5] dark:bg-secondary rounded-[2.5rem] p-6 md:p-12 pb-20 md:pb-24 relative overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Right Side (Content) - Because RTL, this is technically the first item */}
          <div className="flex flex-col gap-6 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full w-fit mb-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-bold">حصري</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-[1.2]"
            >
              توصيل آمن وسريع...
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-foreground/80 leading-relaxed max-w-lg"
            >
              بسهولة وبأمان، خدمتنا في منوف، سرس، وبرهيم تضمن وصول طلباتك من
              نقطة البداية للنهاية بأعلى جودة. تتبع مباشر، تقييم، وأكثر في
              باقتنا المميزة.
            </motion.p>
            <Link href={"/orderForm"}>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 bg-primary text-primary-foreground text-lg font-bold py-4 px-8 rounded-2xl w-fit md:w-80 shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95"
              >
                ابدأ التوصيل الآن
              </motion.button>
            </Link>
          </div>

          {/* Left Side (Image) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative order-1 lg:order-2 h-[400px] md:h-[500px] w-full"
          >
            {/* Main Image Container */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/el-dawaly-hero.png" 
                alt="عملية توصيل آمنة"
                fill 
                className="object-cover"
                priority
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-lg flex flex-col items-center gap-2 border border-white/20"
            >
              <div className="text-xs font-bold text-gray-500 mb-1">حصري</div>
              <div className="bg-[#4a5d3e] text-white p-2 rounded-xl">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div className="flex items-center gap-1.5 mt-1 bg-gray-100 px-2 py-1 rounded-full w-full justify-center">
                <Circle className="w-2 h-2 fill-red-500 text-red-500 animate-pulse" />
                <span className="text-[10px] font-bold text-gray-700">
                  LIVE
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Features Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-8 border-t border-primary/10 relative z-10"
        >
          {/* Feature 1 */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">تغطية محلية</h3>
              <p className="text-sm text-foreground/70">
                تغطية محلية متزامنة في المناطق المحددة.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">خدمة موثوقة</h3>
              <p className="text-sm text-foreground/70">
                خدمة توصيل للطلبات تلبي احتياجاتك.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">تتبع مباشر</h3>
              <p className="text-sm text-foreground/70">
                تتبع مباشر للأوردر في المناطق المحددة.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Decorative Bottom Dark Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-10 md:h-12 bg-primary rounded-t-3xl flex items-center justify-around px-8 md:px-12 text-primary-foreground">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs md:text-sm">الأصالة</span>
            <Check className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs md:text-sm">المرونة</span>
            <Check className="w-4 h-4" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
