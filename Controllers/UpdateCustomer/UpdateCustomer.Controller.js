import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function UpdateCustomerController(request, response) {
  const { name, location, details, phonenumber, type } = request.body;
  const { id } = request.params;

  try {
    const existingCustomer = await prisma.customers.findUnique({
      where: { id },
      include: {
        sales: true,
        purchases: true,
      },
    });

    if (!existingCustomer) {
      return response.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // 2️⃣ Prevent changing type if it violates business logic
    if (type && type !== existingCustomer.type) {
      // ❌ Can't change to SUPPLIER if they have sales
      if (
        existingCustomer.sales.length > 0 &&
        type === "SUPPLIER" &&
        existingCustomer.type !== "BOTH"
      ) {
        return response.status(400).json({
          success: false,
          message:
            "Cannot change this customer to SUPPLIER because they already have sales records.Consider changing to Both",
        });
      }

 
    }

    const updatedCustomer = await prisma.customers.update({
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
    const totalBalance = updatedCustomer.sales.reduce(
      (sum, sale) => sum + sale.balance,
      0,
    );

    // Return customer without full sales list
    const { sales, ...rest } = updatedCustomer;

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
