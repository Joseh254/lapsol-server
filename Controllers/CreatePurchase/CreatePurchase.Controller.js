import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Controller to create purchase
export async function CreatePurchase(req, res) {
  try {
    const { customerId, type, items } = req.body;
    const userId = req.user?.id; // extracted from UserAuth middleware

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    if (!customerId) {
      return res
        .status(400)
        .json({ success: false, message: "Supplier (customerId) is required" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "At least one item is required" });
    }

    // Step 1: Create purchase and connect supplier + user
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

    // Step 2: Loop through items
    for (const item of items) {
      let productId = item.productId;

      if (!productId && item.newProduct) {
        const { productname, price, details, category, quantity } =
          item.newProduct;

        if (!productname || price === undefined) {
          return res.status(400).json({
            success: false,
            message: "Product name and price are required",
          });
        }

        // Upsert product
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

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "Either productId or newProduct must be provided",
        });
      }

      // Step 3: Create purchase item
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

      // Increment stock if existing product
      if (item.productId) {
        await prisma.products.update({
          where: { id: productId },
          data: { quantity: { increment: item.quantity || 1 } },
        });
      }
    }

    // Step 4: Update total & balance
    const updatedPurchase = await prisma.purchase.update({
      where: { id: purchase.id },
      data: {
        total,
        balance: type === "credit" ? total : 0,
      },
      include: { items: true, supplier: true, user: true },
    });

    // Step 5: Update supplier type dynamically
    const supplier = await prisma.customers.findUnique({
      where: { id: customerId },
    });

    if (supplier) {
      let newType = supplier.type;

      if (supplier.type === "CUSTOMER") {
        newType = "BOTH"; // purchased from a customer → now both
      } else if (supplier.type === "SUPPLIER" || supplier.type === "BOTH") {
        newType = supplier.type; // already supplier or both
      }

      if (newType !== supplier.type) {
        await prisma.customers.update({
          where: { id: customerId },
          data: { type: newType },
        });
      }
    }

    res.status(201).json({
      success: true,
      message: "Purchase created successfully",
      purchase: updatedPurchase,
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
