import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const ViewCustomerBalanceController = async (request, response) => {
  try {
    const { id: customerId } = request.params;

    // 1. Ensure customer exists
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

    // 2. Get sales + saleItems + payments
    const sales = await prisma.sale.findMany({
      where: { customerId, type: "credit" },
      select: {
        id: true,
        createdAt: true,
        user: { select: { id: true, firstname: true } },
        saleItems: {
          select: {
            quantity: true,
            unitPrice: true,
            product: { select: { id: true, productname: true } },
          },
        },
        payments: { select: { amount: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // 3. Recalculate totals + filter empty or settled sales
    const salesWithBalances = sales
      .map((sale) => {
        const total = sale.saleItems.reduce(
          (sum, item) => sum + item.quantity * item.unitPrice,
          0
        );

        const totalPayments = sale.payments.reduce(
          (sum, p) => sum + p.amount,
          0
        );

        const balance = total - totalPayments;

        return {
          ...sale,
          total,
          balance,
        };
      })
      .filter((s) => s.saleItems.length > 0 && s.total > 0 && s.balance > 0); //  exclude fully paid sales

    // 4. Customer total balance across valid sales
    const totalBalance = salesWithBalances.reduce(
      (sum, s) => sum + s.balance,
      0
    );

    response.json({
      customerId,
      customerName: customer.name,
      totalBalance,
      sales: salesWithBalances,
    });
  } catch (error) {
    console.log("error getting customer balance", error.message);
    response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
