"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import {
  ClipboardCheck,
  MapPin,
  UserCog,
  Truck,
  ArrowLeft,
} from "lucide-react";

const steps = [
  {
    id: "01",
    title: "اطلب أونلاين",
    description:
      "ادخل على الموقع واملأ الفورم ببيانات طلبك، الموضوع مش بياخد أكتر من دقيقة.",
    icon: <ClipboardCheck className="w-8 h-8" />,
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    id: "02",
    title: "حدد الأماكن",
    description:
      "حدد بالظبط مكان الاستلام ومكان التسليم على الخريطة عشان نضمن الدقة.",
    icon: <MapPin className="w-8 h-8" />,
    color: "bg-red-500/10 text-red-600",
  },
  {
    id: "03",
    title: "تنسيق المكتب",
    description:
      "مدير المكتب بيستلم طلبك فوراً وبيكلف أقرب مندوب متاح لتنفيذ المهمة.",
    icon: <UserCog className="w-8 h-8" />,
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    id: "04",
    title: "التحرك والتسليم",
    description:
      "المندوب بيتحرك فوراً، وتقدر تتابعه لحد ما يوصل الأوردر بأمان.",
    icon: <Truck className="w-8 h-8" />,
    color: "bg-primary/10 text-primary",
  },
];

// Variants for animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function HowItWorksEnhanced() {
  return (
    <section
      id="how-it-works"
      dir="rtl"
      className="py-24 px-4 md:px-12 bg-background border-t border-border overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-20 space-y-4 text-center md:text-right">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block bg-[#d9f99d] text-black text-[10px] md:text-xs font-black px-3 py-1.5 uppercase tracking-widest rounded-sm"
          >
            كيف نعمل
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-foreground leading-[1.15] max-w-3xl"
          >
            رحلة طلبك من الضغطة الأولى <br className="hidden md:block" /> وحتى
            باب البيت.
          </motion.h2>
        </div>

        {/* Steps List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative"
        >
          {/* Vertical line decoration (Desktop only) */}
          <div className="absolute right-[22px] top-0 bottom-0 w-px bg-border hidden md:block" />

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              variants={itemVariants}
              className="group relative grid grid-cols-1 md:grid-cols-12 items-start md:items-center py-12 border-b border-border last:border-b-0"
            >
              {/* Mobile Number Indicator */}
              <div className="flex items-center gap-4 mb-6 md:mb-0 md:col-span-4">
                <span className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-primary/20 flex items-center justify-center font-mono text-lg font-bold text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 z-10 bg-background">
                  {step.id}
                </span>
                <h3 className="text-2xl md:text-3xl font-black group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
              </div>

              {/* Icon Container */}
              <div className="md:col-span-3 flex justify-start md:justify-center mb-6 md:mb-0">
                <motion.div
                  whileHover={{ rotate: -10, scale: 1.1 }}
                  className={`p-5 rounded-[2rem] ${step.color} transition-all duration-500 shadow-sm group-hover:shadow-lg`}
                >
                  {step.icon}
                </motion.div>
              </div>

              {/* Description & Link */}
              <div className="md:col-span-5 space-y-4">
                <p className="text-muted-foreground leading-relaxed text-lg md:text-xl font-medium">
                  {step.description}
                </p>

                <div className="flex items-center gap-2 text-primary font-bold text-sm cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                  <span>تعرف على المزيد</span>
                  <ArrowLeft className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA for Mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 text-center md:hidden"
        >
          <button className="bg-primary text-white px-10 py-4 rounded-2xl font-bold text-lg w-full">
            ابدأ أول طلب الآن
          </button>
        </motion.div>
      </div>
    </section>
  );
}
