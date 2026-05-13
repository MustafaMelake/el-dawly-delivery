import { z } from "zod";

export const orderSchema = z.object({
  clientName: z.string().min(3, "الاسم قصير جداً"),
  clientPhone: z.string().regex(/^01[0125][0-9]{8}$/, "رقم موبايل غير صحيح"),
  description: z.string().min(2, "برجاء وصف محتوى الشحنة"),
  pickupAddress: z.string().min(5, "عنوان الاستلام مطلوب"),
  dropoffAddress: z.string().min(5, "عنوان التوصيل مطلوب"),
  fromZone: z.enum(["MENOUF", "SERS", "BERHEEM"]),
  toZone: z.enum(["MENOUF", "SERS", "BERHEEM"]),
  itemCost: z.coerce.number().min(0, "التكلفة لا يمكن أن تكون سالبة"),
});

export type OrderValues = z.infer<typeof orderSchema>;

export const trackOrderSchema = z.object({
  orderId: z.string().min(1, "برجاء إدخال رقم الطلب"),
});

export type trackOrderSchema = z.infer<typeof trackOrderSchema>