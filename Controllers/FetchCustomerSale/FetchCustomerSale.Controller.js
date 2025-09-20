import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function FetchCustomerSaleController(request, response) {
  try {
    const { id: customerId } = request.params;

    if (!customerId) {
      return response.status(400).json({
        success: false,
        message: "Customer ID is required",
      });
    }

    // Find all sale items for this customer, with product and sale info
    const saleItems = await prisma.saleitem.findMany({
      where: {
        sale: {
          customerId: customerId,
        },
      },
      include: {
        product: true,
        sale: true,
      },
    });

    return response.status(200).json({
      success: true,
      data: saleItems,
    });
  } catch (error) {
    console.error("FetchCustomerSaleController error:", error.message);
    return response.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
