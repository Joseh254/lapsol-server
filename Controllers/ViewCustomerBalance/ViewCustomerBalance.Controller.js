import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const ViewCustomerBalanceController = async (request, response) => {
  try {
    const { id: customerId } = request.params;

    // 1. Validate customer
    const customer = await prisma.customers.findUnique({
      where: { id: customerId },
      select: { id: true, name: true },
    });

    if (!customer) {
      return response.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // 2. Get all credit sales
    const sales = await prisma.sale.findMany({
      where: { customerId, type: "credit" },
      select: {
        id: true,
        createdAt: true,
        user: { select: { firstname: true } },
        saleItems: {
          select: {
            quantity: true,
            unitPrice: true,
            product: { select: { productname: true } },
          },
        },
        payments: { select: { amount: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    let flatSaleItems = [];
    let totalBalance = 0;

    sales.forEach((sale) => {
      const total = sale.saleItems.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      );
      const totalPaid = sale.payments.reduce((sum, p) => sum + p.amount, 0);
      const balance = total - totalPaid;

      if (balance <= 0 || sale.saleItems.length === 0) return; // skip fully paid or empty

      totalBalance += balance;

      // Flatten saleItems
      sale.saleItems.forEach((item) => {
        flatSaleItems.push({
          product: {
            productname: item.product?.productname || "N/A",
          },
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          sale: {
            createdAt: sale.createdAt,
            user: { name: sale.user?.firstname || "Unknown" },
          },
        });
      });
    });

    return response.json({
      success: true,
      customerId,
      customerName: customer.name,
      totalBalance,
      sales: flatSaleItems,
    });
  } catch (error) {
    console.error("Error getting customer balance:", error.message);
    return response.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
