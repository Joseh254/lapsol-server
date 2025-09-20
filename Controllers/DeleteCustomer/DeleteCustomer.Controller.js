import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function DeleteCustomerController(request, response) {
  const { id } = request.params;

  try {
    if (!id) {
      return response.status(400).json({
        success: false,
        message: "Select a customer to remove",
      });
    }

    const customer = await prisma.customers.findUnique({
      where: { id },
    });

    if (!customer) {
      return response.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const unpaidSales = await prisma.sale.findMany({
      where: {
        customerId: id,
        balance: {
          gt: 0,
        },
      },
    });

    const totalDebt = unpaidSales.reduce((sum, sale) => sum + sale.balance, 0);

    // ✅ This is the only check needed
    if (unpaidSales.length > 0) {
      return response.status(400).json({
        success: false,
        message: `Cannot delete ${customer.name} with unpaid balance of Ksh ${totalDebt}`,
      });
    }

    // No debt, delete customer
    await prisma.customers.delete({
      where: { id },
    });

    return response.status(200).json({
      success: true,
      message: `${customer.name} was removed successfully`,
    });
  } catch (error) {
    console.error("Error deleting customer:", error.message);
    return response.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
