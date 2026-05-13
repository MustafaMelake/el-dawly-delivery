"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Banknote, Navigation2 } from "lucide-react";

const zones = [
  {
    name: "منوف",
    price: "20",
    description:
      "تغطية شاملة وسريعة داخل مدينة منوف. بنوصل لأبعد نقطة في أقل وقت ممكن وبسعر ثابت.",
    image: "/menouf-zone.jpg",
  },
  {
    name: "سرس الليان",
    price: "50",
    description:
      "خدمة التوصيل من وإلى سرس الليان متوفرة على مدار الساعة مع ضمان سلامة الأوردر.",
    image: "/sars-zone.jpg",
  },
  {
    name: "برهيم",
    price: "50",
    description:
      "وصلنا تغطيتنا لبرهيم عشان نخدمك في كل مكان حولنا بنفس الكفاءة والدقة.",
    image: "/barheem-zone.jpg",
  },
];

export default function ZoneSection() {
  return (
    <section
      dir="rtl"
      className="relative bg-background border-t border-border"
      id="zones"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row">
        {/* Right Side: Scrollable Content */}
        <div className="w-full lg:w-1/2">
          {zones.map((zone, index) => (
            <div
              key={index}
              className="min-h-screen flex flex-col justify-center px-6 md:px-16 border-b border-border last:border-b-0"
            >
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ margin: "-20%" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-8"
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-sm">
                  <Navigation2 className="w-4 h-4 fill-current" />
                  <span>منطقة نشطة</span>
                </div>

                {/* Zone Name */}
                <h2 className="text-6xl md:text-8xl font-black text-foreground tracking-tighter">
                  {zone.name}
                </h2>

                {/* Price Tag */}
                <div className="flex items-center gap-4 bg-secondary p-6 rounded-3xl w-fit">
                  <div className="bg-primary text-white p-3 rounded-2xl">
                    <Banknote className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-bold">
                      سعر المشوار
                    </p>
                    <p className="text-3xl font-black text-foreground">
                      {zone.price} <span className="text-lg">جنيه</span>
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-md font-medium">
                  {zone.description}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
        {/* Left Side: Sticky Image (Hidden on Mobile) */}
        <div className="hidden lg:block lg:w-1/2 h-screen sticky top-0 overflow-hidden">
          <div className="relative w-full h-full p-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative w-full h-full rounded-[3rem] overflow-hidden shadow-2xl border-8 border-secondary"
            >
              <Image
                src="/eldawly-delivery.png"
                alt="مناطق التغطية"
                fill
                className="object-cover"
              />
              {/* Overlay inside image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-10">
                <div className="text-white">
                  <p className="text-sm font-bold opacity-80 mb-2 tracking-widest uppercase">
                    Coverage Area
                  </p>
                  <h3 className="text-4xl font-black">نغطي أغلب المناطق</h3>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
