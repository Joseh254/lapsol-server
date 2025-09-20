import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function AddCustomerController(request, response) {
  const { name, location, details, phonenumber } = request.body;

  try {
    const newCustomer = await prisma.customers.create({
      data: { name, location, details, phonenumber },
    });
    response.status(200).json({
      success: true,
      data: newCustomer,
      message: "Customer added to database",
    });
  } catch (error) {
    console.log("error adding customer", error.message);
    return response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
