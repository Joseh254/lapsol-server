import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function CreateSale(request, response) {
  const { type, customerId, items } = request.body;

  if (!Array.isArray(items) || items.length === 0) {
    return response.status(400).json({ success: false, message: "No items provided" });
  }

  try {
    const userId = request.user.id;

    const productIds = items.map((item) => item.productId);
    const products = await prisma.products.findMany({
      where: { id: { in: productIds } },
    });

    let total = 0;
    const saleItemsData = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return response.status(400).json({ success: false, message: `Product not found` });
      }
      if (product.quantity < item.quantity) {
        return response.status(400).json({
          success: false,
          message: `Not enough stock for ${product.productname}`,
        });
      }
      total += product.price * item.quantity;

      saleItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
      });
    }

    const paymentMethod = type.toUpperCase();

    const result = await prisma.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: {
          type,
          total,
          balance: type === "credit" ? total : 0,
          userId,
          customerId,
          saleItems: { create: saleItemsData },
        },
        include: { saleItems: true },
      });

      await tx.payment.create({
        data: {
          amount: total,
          method: paymentMethod,
          saleId: sale.id,
        },
      });

      for (const item of items) {
        await tx.products.update({
          where: { id: item.productId },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      return sale;
    });

    return response.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error("Error creating sale:", error);
    return response.status(500).json({ success: false, message: "Internal server error!" });
  }
}
