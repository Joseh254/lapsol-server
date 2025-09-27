import { PrismaClient, CustomerType } from "@prisma/client";
const prisma = new PrismaClient();

export async function FetchAllCustomersController(request, response) {
  try {
    const customers = await prisma.customers.findMany({
      where: {
        type: {
          in: [CustomerType.CUSTOMER, CustomerType.BOTH], // only customer or both
        },
      },
      include: {
        sales: {
          select: { balance: true },
        },
      },
    });

    if (customers.length === 0) {
      return response
        .status(404)
        .json({ success: false, message: "No customers found" });
    }

    // Add up balances
    const enrichedCustomers = customers.map((customer) => {
      const totalBalance = customer.sales.reduce(
        (sum, sale) => sum + sale.balance,
        0,
      );

      const { sales, ...rest } = customer;

      return {
        ...rest,
        balance: totalBalance,
      };
    });

    return response.status(200).json({
      success: true,
      data: enrichedCustomers,
    });
  } catch (error) {
    console.error("Error fetching customers with balance", error.message);
    return response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
