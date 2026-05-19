"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, UserPlus, Percent } from "lucide-react";
import { createCourier } from "@/app/actions/courier";

export function AddCourierModal() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. سحب البيانات من الفورم
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const commissionRate = Number(formData.get("commissionRate")); // تحويل القيمة لرقم متوافق مع نوع الـ Action

    // 2. إرسال البيانات كـ Object متوافق تماماً مع الـ Server Action بتاعك
    startTransition(async () => {
      const result = await createCourier({
        name,
        phone,
        commissionRate,
      });

      if (result.success) {
        setOpen(false); // إغلاق النافذة عند النجاح
      } else {
        alert(result.error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 font-bold rounded-xl h-11 px-6 shadow-sm hover:shadow-md transition-all">
          <Plus className="h-5 w-5" />
          إضافة كابتن جديد
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px] rounded-3xl bg-card border-border p-6"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-black italic text-primary flex items-center gap-2 border-b border-border pb-4 mb-2">
            <UserPlus className="h-6 w-6" />
            تسجيل كابتن جديد
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* حقل الاسم */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-bold text-muted-foreground"
            >
              اسم الكابتن الثلاثي
            </Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="مثال: أحمد محمد علي"
              className="rounded-xl border-border h-11 font-medium bg-background"
            />
          </div>

          {/* حقل رقم الهاتف */}
          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="text-sm font-bold text-muted-foreground"
            >
              رقم الهاتف (للتواصل السريع)
            </Label>
            <Input
              id="phone"
              name="phone"
              required
              placeholder="01xxxxxxxxx"
              className="rounded-xl border-border h-11 font-medium bg-background text-right"
              dir="ltr"
            />
          </div>

          {/* 🎯 حقل نسبة العمولة الجديد */}
          <div className="space-y-2">
            <Label
              htmlFor="commissionRate"
              className="text-sm font-bold text-muted-foreground"
            >
              نسبة عمولة الكابتن (%)
            </Label>
            <div className="relative flex items-center">
              <Input
                id="commissionRate"
                name="commissionRate"
                type="number"
                required
                min={0}
                max={100}
                defaultValue={80} // النسبة الافتراضية الشائعة 80% للكابتن و 20% للمكتب
                placeholder="80"
                className="rounded-xl border-border h-11 font-black bg-background pl-10 text-right"
              />
              <div className="absolute left-3 p-1 text-muted-foreground bg-muted/40 rounded-lg border border-border">
                <Percent className="h-4 w-4" />
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium mr-1">
              * النسبة المئوية التي يحصل عليها الكابتن من رسوم التوصيل (الباقي
              للمكتب).
            </p>
          </div>

          {/* زر الحفظ */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full font-black text-lg rounded-xl h-12 mt-2"
          >
            {isPending ? (
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            ) : (
              "حفظ وإضافة للأسطول"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
