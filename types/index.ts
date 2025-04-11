import { z } from "zod";
import { insertProductSchema } from "@/lib/validators";
export type Product = z.infer<typeof insertProductSchema> & {
  id: string;


  slug: string;
  images: string[];
  stock: number;
  isFeatured: boolean;
  banner: string | null;
  category: string;
  rating: string;
  description: string;
  price: string;
  brand: string;
  numReviews: number;
};
