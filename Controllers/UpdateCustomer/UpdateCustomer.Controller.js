import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function UpdateCustomerController(request, response) {
  const { name, location, details, phonenumber } = request.body;
  const { id } = request.params;
  try {
    const updatedCustomer = await prisma.customers.update({
      where: { id: id },
      data: {
        ...(name && { name }),
        ...(location && { location }),
        ...(details && { details }),
        ...(phonenumber && { phonenumber }),
      },
      select: {
        id: true,
        name: true,
        location: true,
        details: true,
        phonenumber: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return response
      .status(201)
      .json({
        success: true,
        message: `${updatedCustomer.name} details updated`,
      });
  } catch (error) {
    console.log("error updating customer details");
    return response
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
}
