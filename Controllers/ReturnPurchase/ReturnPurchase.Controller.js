import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function ReturnPurchase(req, res) {
  try {
    const { purchaseId, productId, quantity } = req.body;

    if (!purchaseId || !productId || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "purchaseId, productId, and quantity > 0 are required",
      });
    }

    // Fetch purchase item
    const purchaseItem = await prisma.purchaseitem.findFirst({
      where: { purchaseId, productId },
    });

    if (!purchaseItem) {
      return res.status(404).json({
        success: false,
        message: "Purchase item not found or fully returned",
      });
    }

    // Calculate total quantity already returned
    const totalReturnedAgg = await prisma.purchasereturn.aggregate({
      _sum: { quantity: true },
      where: { purchaseId, productId },
    });
    const alreadyReturned = totalReturnedAgg._sum.quantity || 0;

    if (quantity + alreadyReturned > purchaseItem.quantity) {
      return res.status(400).json({
        success: false,
        message: `Return quantity exceeds purchased quantity. You purchased ${purchaseItem.quantity} and already returned ${alreadyReturned}, tried to return ${quantity}.`,
      });
    }

    const refundAmount = quantity * purchaseItem.unitPrice;
    const newTotalReturned = alreadyReturned + quantity;

    await prisma.$transaction([
      // 1️⃣ Update product stock (decrement)
      prisma.products.update({
        where: { id: productId },
        data: { quantity: { decrement: quantity } },
      }),

      // 2️⃣ Record the return
      prisma.purchasereturn.create({
        data: {
          purchaseId,
          productId,
          quantity,
          refundAmount,
        },
      }),

      // 3️⃣ Update purchase total & balance
      prisma.purchase.update({
        where: { id: purchaseId },
        data: {
          total: { decrement: refundAmount },
          balance: { decrement: refundAmount },
        },
      }),

      // 4️⃣ Optionally delete purchase item if fully returned
      newTotalReturned === purchaseItem.quantity
        ? prisma.purchaseitem.delete({
            where: { id: purchaseItem.id },
          })
        : prisma.purchaseitem.update({
            where: { id: purchaseItem.id },
            data: {}, // no-op, just to include in transaction
          }),
    ]);

    // Return appropriate message
    if (newTotalReturned === purchaseItem.quantity) {
      return res.json({
        success: true,
        message:
          "All units returned. Purchase item removed and stock adjusted.",
        refundAmount,
      });
    }

    res.json({
      success: true,
      message: "Product returned successfully and stock adjusted.",
      refundAmount,
    });
  } catch (error) {
    console.error("Error returning purchase item:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      details: error.message,
    });
  }
}
