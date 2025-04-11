import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";
const currency=z
    .string()
    .refine((value)=> /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),'Price must be a valid number with two decimal places')
//schema for insert product
export const insertProductSchema = z.object({
  name: z.string().min(3, { message: "Name is required" }),
  description: z.string().min(3, { message: "Description is required" }),
  price: currency,
  rating: z.string().min(1, { message: "Rating is required" }),
  brand: z.string().min(3, { message: "Brand is required" }),
  images: z.array(z.string().url({ message: "Invalid URL" })),
  category: z.string().uuid({ message: "Invalid category ID" }),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  stock: z.coerce.number(),
  isFeatured: z.boolean(),
  banner: z.string().nullable()
});
