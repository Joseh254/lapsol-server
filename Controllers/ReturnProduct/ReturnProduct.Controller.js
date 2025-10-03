import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function ReturnProductController(request, response) {
  try {
    const { customerId, productId, quantity } = request.body;

    if (!customerId || !productId || !quantity) {
      return response.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 1. Find the latest sale item for this customer & product
    const saleItem = await prisma.saleitem.findFirst({
      where: {
        productId,
        sale: {
          customerId,
          type: "credit",
        },
      },
      include: {
        sale: true,
        product: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!saleItem) {
      return response.status(404).json({
        success: false,
        message: "Sale item not found for this customer",
      });
    }

    if (quantity > saleItem.quantity) {
      return response.status(400).json({
        success: false,
        message: "Return quantity exceeds sold quantity",
      });
    }

    const refundAmount = saleItem.unitPrice * quantity;

    // 2. Update or delete sale item
    if (quantity === saleItem.quantity) {
      await prisma.saleitem.delete({ where: { id: saleItem.id } });
    } else {
      await prisma.saleitem.update({
        where: { id: saleItem.id },
        data: {
          quantity: { decrement: quantity },
        },
      });
    }

    // 3. Restock product
    await prisma.products.update({
      where: { id: productId },
      data: {
        quantity: { increment: quantity },
      },
    });

    // 4. Adjust the sale balance (reduce owed amount)
    await prisma.sale.update({
      where: { id: saleItem.saleId },
      data: {
        balance: { decrement: refundAmount },
        total: { decrement: refundAmount },
      },
    });

    // 5. Log return
    await prisma.productreturn.create({
      data: {
        customerId,
        productId,
        saleId: saleItem.saleId,
        quantity,
        refundAmount,
      },
    });

    return response.status(200).json({
      success: true,
      message: "Product returned successfully",
      refundAmount,
      product: saleItem.product.productname,
      saleId: saleItem.saleId,
      customerId,
    });
  } catch (error) {
    console.error("ReturnProductController error:", error.message);
    return response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
