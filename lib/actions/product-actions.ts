"use server";
import { prisma } from "@/db/prisma";
import { convertToPlaObject } from "@/lib/utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
// GET LATEST PRODUCT
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: 'desc'}
  });
  return convertToPlaObject(data);
}
// Get single product by its slug
export async function getProductBySlug(slug: string) {
   return await prisma.product.findFirst({
    where: { slug: slug },
  });
}
