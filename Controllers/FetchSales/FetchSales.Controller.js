import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function FetchSalesController(request, response) {
  const { date, id } = request.query;

  try {
    // Fetch sales
    const sales = await prisma.sale.findMany({
      where: {
        ...(id && { id: id }),
        ...(date && {
          createdAt: {
            gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
            lt: new Date(new Date(date).setHours(23, 59, 59, 999)),
          },
        }),
      },
      include: {
        customer: { select: { id: true, name: true, phonenumber: true } },
        user: { select: { id: true, username: true } },
        saleItems: {
          include: {
            product: {
              select: { id: true, productname: true, price: true },
            },
          },
        },
        payments: { select: { id: true, amount: true, method: true, createdAt: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch purchases
    const purchases = await prisma.purchase.findMany({
      where: {
        ...(id && { id: id }),
        ...(date && {
          createdAt: {
            gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
            lt: new Date(new Date(date).setHours(23, 59, 59, 999)),
          },
        }),
      },
      include: {
        supplier: { select: { id: true, name: true, phonenumber: true } },
        user: { select: { id: true, username: true } },
        items: {
          include: {
            product: {
              select: { id: true, productname: true, price: true },
            },
          },
        },
        payments: { select: { id: true, amount: true, method: true, createdAt: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Format sales
    const formattedSales = sales.map((sale) => ({
      id: sale.id,
      date: sale.createdAt,
      total: sale.total,
      balance: sale.balance,
      customer: sale.customer,
      user: sale.user,
      items: sale.saleItems.map((item) => ({
        product: item.product.productname,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice,
      })),
      payments: sale.payments.map((p) => ({
        id: p.id,
        amount: p.amount,
        method: p.method || "CREDIT",
        date: p.createdAt,
      })),
      transactionType: "Sale", // <-- mark as Sale
    }));

    // Format purchases
    const formattedPurchases = purchases.map((purchase) => ({
      id: purchase.id,
      date: purchase.createdAt,
      total: purchase.total,
      balance: purchase.balance,
      customer: purchase.supplier, // supplier is the other party in purchases
      user: purchase.user,
      items: purchase.items.map((item) => ({
        product: item.product.productname,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice,
      })),
      payments: purchase.payments.map((p) => ({
        id: p.id,
        amount: p.amount,
        method: p.method || "CREDIT",
        date: p.createdAt,
      })),
      transactionType: "Purchase", // <-- mark as Purchase
    }));

    // Combine sales and purchases
    const allTransactions = [...formattedSales, ...formattedPurchases];

    return response.status(200).json({
      success: true,
      data: allTransactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    return response.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
