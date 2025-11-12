import { PrismaClient } from "@prisma/client";
import { recordCustomerPaymentService } from "../../Services/RecordPayment/RecordCustomerPaymentService.js";
const prisma = new PrismaClient();

export async function CreateSale(request, response) {
  const { type, customerId, items, narration, details } = request.body; // ✅ added narration & details

  if (!Array.isArray(items) || items.length === 0) {
    return response
      .status(400)
      .json({ success: false, message: "No items provided" });
  }

  try {
    const userId = request.user.id;

    // Fetch all involved products
    const productIds = items.map((item) => item.productId);
    const products = await prisma.products.findMany({
      where: { id: { in: productIds } },
    });

    let total = 0;
    const saleItemsData = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);

      if (!product)
        return response
          .status(400)
          .json({ success: false, message: `Product not found` });

      if (product.quantity < item.quantity)
        return response.status(400).json({
          success: false,
          message: `Not enough stock for ${product.productname}`,
        });

      const customPrice = item.price ?? product.price;

      total += customPrice * item.quantity;

      saleItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: customPrice,
      });
    }

    // 🧾 Create sale transaction
    const sale = await prisma.$transaction(async (tx) => {
      const createdSale = await tx.sale.create({
        data: {
          type,
          total,
          balance: total,
          userId,
          customerId,
          // ✅ only include optional fields if provided
          ...(narration && { narration }),
          ...(details && { details }),
          saleItems: { create: saleItemsData },
        },
        include: { saleItems: true },
      });

      // Decrease stock
      for (const item of items) {
        await tx.products.update({
          where: { id: item.productId },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      return createdSale;
    });

    // 💰 If sale is not on credit, record payment via the service
    if (type.toLowerCase() !== "credit") {
      await recordCustomerPaymentService({
        saleId: sale.id,
        amount: total,
        method: type,
      });
    }

    return response.status(201).json({
      success: true,
      message: "Sale created successfully",
      data: sale,
    });
  } catch (error) {
    console.error("Error creating sale:", error);
    return response.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
}
