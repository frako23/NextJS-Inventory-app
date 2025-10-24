"use server";

import { th } from "zod/locales";
import { getCurrentUser } from "../auth";
import { prisma } from "../prisma";
import { z } from "zod";
import { redirect } from "next/navigation";

const ProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.coerce.number().min(0, "Price must be at least 0"),
  quantity: z.coerce.number().min(0, "Quantity must be at least 0"),
  sku: z.string().optional(),
  lowStockAt: z.coerce.number().min(0).optional(),
});

export async function deleteProduct(formData: FormData) {
  const user = await getCurrentUser();
  const userId = user.id;
  const id = String(formData.get("id") || "");

  await prisma.product.deleteMany({
    where: {
      id,
      userId,
    },
  });
}

export async function addProduct(formData: FormData) {
  const user = await getCurrentUser();

  const parsed = ProductSchema.safeParse({
    name: String(formData.get("name")),
    price: formData.get("price"),
    quantity: formData.get("quantity"),
    sku: String(formData.get("sku") || undefined),
    lowStockAt: formData.get("lowStockAt") || undefined,
  });

  if (!parsed.success) {
    throw new Error("Invalid form data");
  }

  try {
    await prisma.product.create({
      data: { ...parsed.data, userId: user.id },
    });
  } catch (error) {
    console.error("Error al agregar producto:", error);
    throw new Error("Failed to add product");
  }
  redirect("/inventory");
}
