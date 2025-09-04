import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function FetchOneCustomerController(request, response) {
  const { id } = request.params;
  try {
    if (!id) {
      return response
        .status(400)
        .json({ success: false, message: "customer id is required" });
    }
    const customer = await prisma.customers.findFirst({
      where: { id: id },
    });
    if (!customer) {
      return response
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }
    response.status(200).json({ success: true, data: customer });
  } catch (error) {
    console.log("error getting the customer", error.message);
    return response
      .status(500)
      .json({ success: false, message: "internal server error!" });
  }
}
