import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function ReturnProductController(request, response) {
  try {
    const { customerId, productId, quantity } = request.body;

    // 1. Find the sale item for this customer & product
    const saleItem = await prisma.saleitem.findFirst({
      where: {
        productId,
        sale: { customerId }, // 👈 filter sale by customer
      },
      include: { sale: true, product: true },
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

    // 2. Update sale balance & total
    await prisma.sale.update({
      where: { id: saleItem.saleId },
      data: {
        total: { decrement: refundAmount },
        balance: { decrement: refundAmount },
      },
    });

    // 3. If full quantity returned → delete saleItem
    if (quantity === saleItem.quantity) {
      await prisma.saleitem.delete({ where: { id: saleItem.id } });
    } else {
      await prisma.saleitem.update({
        where: { id: saleItem.id },
        data: { quantity: { decrement: quantity } },
      });
    }

    // 4. Restock product
    await prisma.products.update({
      where: { id: productId },
      data: { quantity: { increment: quantity } },
    });

    response.status(200).json({
      success: true,
      message: "Product returned successfully",
      refundAmount,
      product: saleItem.product.productname,
      customerId,
    });
  } catch (error) {
    console.error("ReturnProductController error:", error.message);
    response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
