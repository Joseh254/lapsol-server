import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function AddCustomerController(request, response) {
  const { name, location, details, phonenumber, type } = request.body;

  try {
    const newCustomer = await prisma.customers.create({
      data: { name, location, details, phonenumber, type },
    });

    // Manually attach balance: 0 (since they have no sales yet)
    const customerWithBalance = {
      ...newCustomer,
      balance: 0,
    };

    return response.status(200).json({
      success: true,
      data: customerWithBalance,
      message: "Customer added to database",
    });
  } catch (error) {
    console.log("error adding customer", error.message);
    return response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
