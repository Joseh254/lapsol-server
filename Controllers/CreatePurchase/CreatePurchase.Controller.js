import { PrismaClient } from "@prisma/client";
import { recordPurchasePaymentService } from "../../Services/RecordPayment/RecordSupplierPaymentService.js";

const prisma = new PrismaClient();

export async function CreatePurchase(req, res) {
  try {
    const { customerId, type, items } = req.body;
    const userId = req.user?.id;

    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });

    if (!customerId)
      return res
        .status(400)
        .json({ success: false, message: "Supplier (customerId) is required" });

    if (!items || !Array.isArray(items) || items.length === 0)
      return res
        .status(400)
        .json({ success: false, message: "At least one item is required" });

    // Step 1: Create purchase
    const purchase = await prisma.purchase.create({
      data: {
        type: type || "cash",
        total: 0,
        balance: 0,
        supplier: { connect: { id: customerId } },
        user: { connect: { id: userId } },
      },
    });

    let total = 0;

    // Step 2: Handle items
    for (const item of items) {
      let productId = item.productId;

      if (!productId && item.newProduct) {
        const { productname, price, details, category, quantity } =
          item.newProduct;

        if (!productname || price === undefined)
          return res.status(400).json({
            success: false,
            message: "Product name and price are required",
          });

        const newProd = await prisma.products.upsert({
          where: { productname },
          update: { quantity: { increment: quantity || 1 } },
          create: {
            productname,
            price,
            details: details ?? "No details provided",
            category: category ?? "Uncategorized",
            quantity: quantity || 1,
          },
        });

        productId = newProd.id;
      }

      if (!productId)
        return res.status(400).json({
          success: false,
          message: "Either productId or newProduct must be provided",
        });

      await prisma.purchaseitem.create({
        data: {
          purchaseId: purchase.id,
          productId,
          quantity: item.quantity || 1,
          unitPrice: item.unitPrice ?? item.newProduct?.price ?? 0,
        },
      });

      total +=
        (item.quantity || 1) * (item.unitPrice ?? item.newProduct?.price ?? 0);

      if (item.productId) {
        await prisma.products.update({
          where: { id: productId },
          data: { quantity: { increment: item.quantity || 1 } },
        });
      }
    }

    // ✅ Step 3: Always set balance = total first
    const updatedPurchase = await prisma.purchase.update({
      where: { id: purchase.id },
      data: {
        total,
        balance: total, // ✅ this ensures the payment logic can decrement it
      },
      include: { items: true, supplier: true, user: true },
    });

    // Step 4: Handle supplier type
    const supplier = await prisma.customers.findUnique({
      where: { id: customerId },
    });

    if (supplier) {
      let newType = supplier.type;
      if (supplier.type === "CUSTOMER") newType = "BOTH";
      if (newType !== supplier.type) {
        await prisma.customers.update({
          where: { id: customerId },
          data: { type: newType },
        });
      }
    }

    // ✅ Step 5: Record payment if not credit
    let paymentResult = null;
    if (type.toLowerCase() !== "credit") {
      paymentResult = await recordPurchasePaymentService({
        purchaseId: updatedPurchase.id,
        amount: total,
        method: type, // e.g., cash, mpesa, etc.
      });
    }

    res.status(201).json({
      success: true,
      message: "Purchase created successfully",
      purchase: updatedPurchase,
      payment: paymentResult,
    });
  } catch (error) {
    console.log("Error creating purchase:", error);
    res.status(500).json({
      success: false,
      message: "Error creating purchase",
      details: error.message,
    });
  }
}
