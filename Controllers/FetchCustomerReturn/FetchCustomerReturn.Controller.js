import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function FetchCustomerReturnController(request, response) {
  try {
    const { customerId } = request.query; // 👈 get query param

    const whereClause = customerId ? { customerId } : {}; // 👈 filter if provided

    const returns = await prisma.productreturn.findMany({
      where: whereClause,
      include: {
        customer: true,
        product: true,
        sale: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return response.status(200).json({
      success: true,
      data: returns,
    });
  } catch (error) {
    console.error("FetchCustomerReturnController error:", error.message);
    return response.status(500).json({
      success: false,
      message: "Failed to fetch customer returns",
    });
  }
}
