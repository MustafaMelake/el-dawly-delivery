"use client";

import React, { useState, useTransition } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Eye, Loader2 } from "lucide-react";
import { updateCourierStatus, deleteCourier } from "@/app/actions/courier";
import { CourierStatsModal } from "./CourierStatsModal";
import { CourierStatus } from "@prisma/client";

type OrderData = { deliveryFee: number; createdAt: Date };
type CourierWithOrders = {
  id: string;
  name: string;
  phone: string;
  status: string;
  commissionRate?: number | null;
  orders: OrderData[];
};

export function CouriersClient({
  couriers,
}: {
  couriers: CourierWithOrders[];
}) {
  const [selectedCourier, setSelectedCourier] =
    useState<CourierWithOrders | null>(null);
  const [isPending, startTransition] = useTransition();
  const [activeId, setActiveId] = useState<string | null>(null); // لمعرفة أي عنصر يتم تحديثه الآن

  // دالة التعامل مع تغيير الحالة سريعا
  const handleStatusChange = (id: string, newStatus: CourierStatus) => {
    setActiveId(id);
    startTransition(async () => {
      const res = await updateCourierStatus(id, newStatus);
      if (!res.success) alert(res.error);
      setActiveId(null);
    });
  };

  // دالة حذف الطيار
  const handleDelete = (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف الكابتن "${name}" نهائياً من النظام؟`))
      return;

    setActiveId(id);
    startTransition(async () => {
      const res = await deleteCourier(id);
      if (!res.success) alert(res.error);
      setActiveId(null);
    });
  };

  return (
    <>
      <Card className="rounded-2xl border-border shadow-sm overflow-hidden bg-card/60 backdrop-blur-md">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-border">
                  <TableHead className="text-right font-black py-4">
                    اسم الكابتن
                  </TableHead>
                  <TableHead className="text-right font-black py-4">
                    رقم الهاتف
                  </TableHead>
                  <TableHead className="text-right font-black py-4 w-[160px]">
                    الحالة المباشرة
                  </TableHead>
                  <TableHead className="text-right font-black py-4">
                    أوردرات الشهر
                  </TableHead>
                  <TableHead className="text-center font-black py-4">
                    إجراءات التحكم
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {couriers.map((courier) => {
                  const isCurrentLoading = isPending && activeId === courier.id;

                  return (
                    <TableRow
                      key={courier.id}
                      className="border-b border-border hover:bg-muted/10 transition-colors"
                    >
                      {/* اسم العامل */}
                      <TableCell className="font-bold text-base py-4">
                        {courier.name}
                      </TableCell>

                      {/* رقم الهاتف */}
                      <TableCell
                        className="text-muted-foreground font-medium py-4"
                        dir="ltr"
                      >
                        {courier.phone}
                      </TableCell>

                      {/* تغيير الحالة الفوري */}
                      <TableCell className="py-4">
                        <Select
                          disabled={isCurrentLoading}
                          defaultValue={courier.status}
                          onValueChange={(val) =>
                            handleStatusChange(courier.id, val as CourierStatus)
                          }
                        >
                          <SelectTrigger className="h-9 rounded-xl font-bold border-border bg-background">
                            {isCurrentLoading && activeId === courier.id ? (
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mx-auto" />
                            ) : (
                              <SelectValue />
                            )}
                          </SelectTrigger>
                          <SelectContent
                            className="rounded-xl font-bold"
                            dir="rtl"
                          >
                            <SelectItem
                              value="AVAILABLE"
                              className="text-emerald-600 font-bold"
                            >
                              🟢 متاح (Available)
                            </SelectItem>
                            <SelectItem
                              value="BUSY"
                              className="text-amber-600 font-bold"
                            >
                              🟡 في مشوار (Busy)
                            </SelectItem>
                            <SelectItem
                              value="OFFLINE"
                              className="text-muted-foreground font-bold"
                            >
                              ⚫ غير نشط (Offline)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>

                      {/* عدد الأوردرات */}
                      <TableCell className="font-black text-primary py-4">
                        {courier.orders.length}{" "}
                        <span className="text-xs text-muted-foreground font-bold">
                          أوردر
                        </span>
                      </TableCell>

                      {/* أزرار التحكم المختصرة */}
                      <TableCell className="py-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* زر عرض الحسابات */}
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 gap-1 font-bold rounded-xl border-border hover:bg-muted"
                            onClick={() => setSelectedCourier(courier)}
                          >
                            <Eye className="h-4 w-4 text-primary" />
                            عرض الحسابات
                          </Button>

                          {/* زر حذف الكابتن */}
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isCurrentLoading}
                            className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() =>
                              handleDelete(courier.id, courier.name)
                            }
                          >
                            {isCurrentLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* الـ Modal المفصول واستدعائه بشكل نظيف هنا */}
      <CourierStatsModal
        courier={selectedCourier}
        onClose={() => setSelectedCourier(null)}
      />
    </>
  );
}
