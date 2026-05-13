/* eslint-disable react/jsx-key */
"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaArrowUp,
} from "react-icons/fa6";
import { IoMailOutline, IoCallOutline } from "react-icons/io5";
export default function Footer() {
  return (
    <>
      <div className="h-[650px] md:h-[500px] pointer-events-none" />

      <footer
        dir="rtl"
        className="fixed bottom-0 left-0 w-full h-[650px] md:h-[500px] bg-[#0a0a0a] text-white -z-10 flex flex-col justify-between p-6 md:p-16"
      >
        <div className="absolute top-0 left-0 right-0 overflow-hidden opacity-[0.1] pointer-events-none select-none">
          <h2 className="text-[22vw] font-black leading-none text-center -translate-y-1/4">
            الدولي
          </h2>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-8">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter">
              الدولي<span className="text-[#d9f99d] text-2xl">©</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-sm leading-relaxed">
              حلول توصيل ذكية وشاملة في منوف وسرس وبرهيم، نضمن وصول طلباتك بأمان
              وسرعة.
            </p>

            <div className="space-y-4 text-xl md:text-2xl font-bold">
              <a
                href="mailto:info@eldawly.com"
                className="flex items-center gap-3 hover:text-[#d9f99d] transition-all group"
              >
                <IoMailOutline className="text-[#d9f99d]" />
                <span>info@eldawly.com</span>
                <FaArrowUp className="rotate-45 opacity-0 group-hover:opacity-100 transition-all text-sm" />
              </a>
              <a
                href="tel:0123456789"
                className="flex items-center gap-3 hover:text-[#d9f99d] transition-all group"
              >
                <IoCallOutline className="text-[#d9f99d]" />
                <span>0123 456 7890</span>
                <FaArrowUp className="rotate-45 opacity-0 group-hover:opacity-100 transition-all text-sm" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between py-2">
            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#d9f99d]">
                اشترك الآن
              </p>
              <div className="relative border-b border-white/20 group focus-within:border-[#d9f99d] transition-all">
                <input
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  className="w-full bg-transparent py-4 outline-none text-xl placeholder:text-gray-600"
                />
                <button className="absolute left-0 bottom-4 font-bold hover:text-[#d9f99d]">
                  إرسال
                </button>
              </div>
            </div>

            <div className="flex gap-4 mt-8 lg:mt-0">
              {[<FaFacebookF />, <FaInstagram />, <FaWhatsapp />].map(
                (icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#d9f99d] hover:text-black transition-all duration-500"
                  >
                    {icon}
                  </a>
                )
              )}
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-gray-500">
          <p>
            © {new Date().getFullYear()} EL DAWLY. تصميم احترافي لخدمات التوصيل.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">
              سياسة الخصوصية
            </a>
            <a href="#" className="hover:text-white">
              الشروط
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
