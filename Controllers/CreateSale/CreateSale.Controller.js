import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function CreateSale(request, response) {
  const { type, customerId, items } = request.body;

  try {
    // 1. Extract userId from cookie
    const userId = request.user.id;

    // 2. Fetch products
    const productIds = items.map((index) => index.productId);
    const products = await prisma.products.findMany({
      where: { id: { in: productIds } },
    });

    // 3. Validate products & calculate total
    let total = 0;
    const saleItemsData = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return response
          .status(400)
          .json({ success: false, message: `Product  not found` });
      }
      if (product.quantity < item.quantity) {
        return response
          .status(400)
          .json({
            success: false,
            message: `Not enough stock for ${product.productname}`,
          });
      }

      const lineTotal = product.price * item.quantity;
      total += lineTotal;

      saleItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
      });
    }

    // 4. Create sale + saleItems
    const sale = await prisma.sale.create({
      data: {
        type,
        total,
        balance: type === "credit" ? total : 0,
        userId, // <-- comes from cookie
        customerId,
        saleItems: { create: saleItemsData },
      },
      include: { saleItems: true },
    });

    // 5. Deduct stock
    for (const item of items) {
      await prisma.products.update({
        where: { id: item.productId },
        data: { quantity: { decrement: item.quantity } },
      });
    }

    return response.status(201).json({ success: true, data: sale });
  } catch (error) {
    console.error("Error creating sale:", error.message);
    return response
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
}
