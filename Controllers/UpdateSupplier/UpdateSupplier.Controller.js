import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function UpdateSupplierController(request, response) {
  const { name, location, details, phonenumber, type } = request.body;
  const { id } = request.params;

  try {
    const updatedSupplier = await prisma.customers.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(location && { location }),
        ...(details && { details }),
        ...(phonenumber && { phonenumber }),
        ...(type && { type }),
      },
      include: {
        sales: {
          select: {
            balance: true,
          },
        },
      },
    });

    // Calculate total balance
    const totalBalance = updatedSupplier.sales.reduce(
      (sum, sale) => sum + sale.balance,
      0,
    );

    // Return customer without full sales list
    const { sales, ...rest } = updatedSupplier;

    return response.status(200).json({
      success: true,
      message: `${rest.name} details updated`,
      data: {
        ...rest,
        balance: totalBalance,
      },
    });
  } catch (error) {
    console.error("Error updating customer:", error.message);

    if (error.code === "P2002") {
      return response.status(409).json({
        success: false,
        message: "Phone number already exists",
      });
    }

    return response.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
}
