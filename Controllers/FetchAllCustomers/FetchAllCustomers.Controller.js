import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function FetchAllCustomersController(request, response) {
  try {
    const AllCustomers = await prisma.customers.findMany();
    if (AllCustomers.length == 0) {
      return response
        .status(404)
        .json({ success: false, message: "No customers found" });
    }
    response.status(200).json({ success: true, data: AllCustomers });
  } catch (error) {
    console.log("error fetching all customers", error.message);
    return response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
