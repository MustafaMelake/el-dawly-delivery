// src/app/admin/orders/orders-client.tsx
"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  assignCourierToOrder,
  updateOrderStatus,
} from "../../app/actions/order";
import { Order, Courier, OrderStatus, Zone } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
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
import { MapPin, Phone, Truck } from "lucide-react";

// استدعاء كومبوننت التفاصيل المستقل
import { OrderDetailsModal } from "./orderDetails";

type OrderWithCourier = Order & { courier: Courier | null };

interface OrdersClientProps {
  initialOrders: OrderWithCourier[];
  couriers: Courier[];
}

const statusMap: Record<
  OrderStatus,
  { label: string; className: string; dotColor: string }
> = {
  PENDING: {
    label: "قيد الانتظار",
    className: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    dotColor: "bg-orange-500",
  },
  ASSIGNED: {
    label: "تم التعيين",
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    dotColor: "bg-blue-500",
  },
  DELIVERED: {
    label: "تم التسليم",
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    dotColor: "bg-emerald-500",
  },
  CANCELLED: {
    label: "ملغي",
    className: "bg-destructive/10 text-destructive border-destructive/20",
    dotColor: "bg-destructive",
  },
};

const zoneMap: Record<Zone, string> = {
  MENOUF: "منوف",
  SERS: "سرِس",
  BERHEEM: "برهيم",
};

export function OrdersClient({ initialOrders, couriers }: OrdersClientProps) {
  const [activeTab, setActiveTab] = useState<OrderStatus | "ALL">("ALL");
  const [selectedOrder, setSelectedOrder] = useState<OrderWithCourier | null>(
    null
  );
  const [isPending, startTransition] = useTransition();

  const filteredOrders = initialOrders.filter((order) => {
    if (activeTab === "ALL") return true;
    return order.status === activeTab;
  });

  const handleAssignCourier = (orderId: string, courierId: string) => {
    startTransition(async () => {
      const result = await assignCourierToOrder(orderId, courierId);
      if (!result.success) alert(result.error);
    });
  };

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, newStatus);
      if (!result?.success)
        alert(result?.error || "حدث خطأ أثناء تحديث الحالة");
    });
  };

  return (
    <div className="space-y-6">
      {/* التابات لتصفية الحالات */}
      <div className="flex gap-2 border-b border-border pb-px overflow-x-auto">
        {(
          ["ALL", "PENDING", "ASSIGNED", "DELIVERED", "CANCELLED"] as const
        ).map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "ghost"}
            className={`rounded-b-none rounded-t-xl px-6 py-5 font-bold transition-all relative ${
              activeTab === tab
                ? "bg-primary text-primary-foreground text-base"
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "ALL" ? "كل الطلبات" : statusMap[tab].label}
            {activeTab === tab && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"
              />
            )}
          </Button>
        ))}
      </div>

      {/* الجدول الرئيسي */}
      <Card className="rounded-2xl border-border shadow-sm overflow-hidden bg-card/60 backdrop-blur-md">
        <CardContent className="px-5">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <tr className="border-b border-border">
                  <TableHead className="text-right font-black text-sm py-4">
                    بيانات العميل
                  </TableHead>
                  <TableHead className="text-right font-black text-sm py-4">
                    خط السير
                  </TableHead>
                  <TableHead className="text-right font-black text-sm py-4">
                    الماليات
                  </TableHead>
                  <TableHead className="text-right font-black text-sm py-4">
                    حالة الطلب
                  </TableHead>
                  <TableHead className="text-right font-black text-sm py-4">
                    تعيين الكابتن
                  </TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <TableCell
                        colSpan={5}
                        className="text-center py-16 text-muted-foreground font-medium text-lg"
                      >
                        لا توجد طلبات في هذا القسم حالياً.
                      </TableCell>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <motion.tr
                        key={order.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setSelectedOrder(order)} // 👈 تفعيل فتح الـ Modal
                        className="border-b border-border hover:bg-muted/30 transition-colors group cursor-pointer"
                      >
                        <TableCell className="align-middle py-6">
                          <div className="font-black text-foreground text-lg group-hover:text-primary transition-colors">
                            {order.clientName}
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2 font-semibold">
                            <Phone className="h-4 w-4 text-primary" />
                            <span dir="ltr" className="tracking-wide">
                              {order.clientPhone}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="align-middle py-6">
                          <div className="flex items-center gap-2 text-base font-bold text-foreground">
                            <MapPin className="h-5 w-5 text-primary" />
                            <span>{zoneMap[order.fromZone]}</span>
                            <span className="text-muted-foreground font-normal mx-1">
                              إلى
                            </span>
                            <span>{zoneMap[order.toZone]}</span>
                          </div>
                        </TableCell>

                        <TableCell className="align-middle py-6">
                          <div className="text-lg font-black text-primary flex items-baseline gap-1">
                            +{order.deliveryFee}{" "}
                            <span className="text-sm">ج.م</span>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1.5 font-bold">
                            إجمالي:{" "}
                            <span className="text-foreground">
                              {order.totalCollected} ج.م
                            </span>
                          </div>
                        </TableCell>

                        <TableCell
                          className="align-middle py-6"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Select
                            disabled={isPending}
                            defaultValue={order.status}
                            onValueChange={(value) =>
                              handleUpdateStatus(order.id, value as OrderStatus)
                            }
                          >
                            <SelectTrigger
                              className={`w-[145px] font-bold text-sm h-10 rounded-xl ${
                                statusMap[order.status].className
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`h-2 w-2 rounded-full ${
                                    statusMap[order.status].dotColor
                                  } animate-pulse`}
                                />
                                <SelectValue />
                              </div>
                            </SelectTrigger>
                            <SelectContent
                              className="rounded-xl p-1 text-right"
                              dir="rtl"
                            >
                              {(Object.keys(statusMap) as OrderStatus[]).map(
                                (statusKey) => (
                                  <SelectItem
                                    key={statusKey}
                                    value={statusKey}
                                    className={`font-bold text-sm cursor-pointer rounded-lg m-0.5 py-2 px-3 ${
                                      order.status === statusKey
                                        ? statusMap[statusKey].className
                                        : "hover:bg-muted"
                                    }`}
                                  >
                                    {statusMap[statusKey].label}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </TableCell>

                        <TableCell
                          className="align-middle py-6"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Select
                            disabled={
                              isPending ||
                              order.status === "DELIVERED" ||
                              order.status === "CANCELLED"
                            }
                            defaultValue={order.courierId || undefined}
                            onValueChange={(value) =>
                              handleAssignCourier(order.id, value)
                            }
                          >
                            <SelectTrigger className="w-[190px] font-bold text-sm h-11 rounded-xl bg-background shadow-sm">
                              <SelectValue placeholder="اختر كابتن للتوصيل" />
                            </SelectTrigger>
                            <SelectContent
                              className="rounded-xl p-1 text-right"
                              dir="rtl"
                            >
                              {couriers.map((courier) => (
                                <SelectItem
                                  key={courier.id}
                                  value={courier.id}
                                  className="font-bold text-sm rounded-lg m-0.5 py-2.5"
                                >
                                  <div className="flex items-center justify-between w-full gap-4">
                                    <div className="flex items-center gap-2">
                                      <Truck className="h-4 w-4 opacity-70" />
                                      <span>{courier.name}</span>
                                    </div>
                                    <span
                                      className={`text-[10px] px-2 py-0.5 rounded-md font-black ${
                                        courier.status === "AVAILABLE"
                                          ? "bg-emerald-500/15 text-emerald-600"
                                          : "bg-amber-500/15 text-amber-600"
                                      }`}
                                    >
                                      {courier.status === "AVAILABLE"
                                        ? "متاح"
                                        : "مشغول"}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 🎯 استدعاء الكومبوننت المستقل هنا */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
