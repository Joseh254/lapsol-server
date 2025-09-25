import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function CreatePurchase(req, res) {
  try {
    const { customerId, userId, type, items } = req.body;

    // Step 1: Create purchase record
    const purchase = await prisma.purchase.create({
      data: {
        customerId,
        userId,
        type,
        total: 0,
        balance: 0,
      },
    });

    let total = 0;

    // Step 2: Loop through items
    for (const item of items) {
      let productId = item.productId;

      if (!productId && item.newProduct) {
        const { productname, price, details, category } = item.newProduct;

        // Fallback defaults if fields are missing
        const newProd = await prisma.products.upsert({
          where: { productname }, // assumes productname is unique
          update: {
            quantity: { increment: item.quantity || 1 },
          },
          create: {
            productname,
            price: price ?? 0, // default 0 if missing
            details: details ?? "No details provided",
            category: category ?? "Uncategorized",
            quantity: item.quantity || 1, // default 1 if missing
          },
        });

        productId = newProd.id;
      }

      if (!productId) {
        return res
          .status(400)
          .json({ error: "Either productId or newProduct must be provided" });
      }

      // Create purchase item
      await prisma.purchaseitem.create({
        data: {
          purchaseId: purchase.id,
          productId,
          quantity: item.quantity || 1,
          unitPrice: item.unitPrice ?? 0, // default 0 if missing
        },
      });

      total += (item.quantity || 1) * (item.unitPrice ?? 0);

      // If product already existed, increment stock here
      if (item.productId) {
        await prisma.products.update({
          where: { id: productId },
          data: {
            quantity: { increment: item.quantity || 1 },
          },
        });
      }
    }

    // Step 3: Update total & balance in purchase
    const updatedPurchase = await prisma.purchase.update({
      where: { id: purchase.id },
      data: {
        total,
        balance: type === "credit" ? total : 0,
      },
      include: { items: true },
    });

    res.json(updatedPurchase);
  } catch (error) {
    console.error("Error creating purchase:", error);
    res.status(500).json({
      error: "Error creating purchase",
      details: error.message,
    });
  }
}
