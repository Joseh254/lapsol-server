import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const ViewCustomerBalanceController = async (request, response) => {
  try {
    const { customerId } = request.params;

    const sales = await prisma.sale.findMany({
      where: { customerId, type: "credit" },
      select: {
        id: true,
        total: true,
        balance: true,
        createdAt: true,
        customer: {
          select: { id: true, name: true }, // fetch customer name
        },
        user: {
          select: { id: true, firstname: true }, // fetch seller info
        },
      },
      orderBy: { createdAt: "desc" }, // sort latest first
    });

    const totalBalance = sales.reduce((sum, s) => sum + s.balance, 0);

    const customerName = sales.length > 0 ? sales[0].customer.name : null;

    response.json({
      customerId,
      customerName,
      sales,
      totalBalance,
    });
  } catch (error) {
    console.log("error getting customer balance", error.message);

    response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
