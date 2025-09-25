import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Fetch all purchase returns, optionally filtered by customerId
 * Query param: customerId (optional)
 */
export async function FetchPurchaseReturns(req, res) {
  try {
    const { customerId } = req.query;

    // Build where condition dynamically
    const whereCondition = customerId
      ? { purchase: { customerId } }
      : {}; // no filter → all returns

    const returns = await prisma.purchasereturn.findMany({
      where: whereCondition,
      include: {
        purchase: {
          select: {
            id: true,
            type: true,
            total: true,
            balance: true,
            createdAt: true,
            supplier: {
              select: {
                id: true,
                name: true,
                phonenumber: true,
              },
            },
          },
        },
        product: {
          select: {
            id: true,
            productname: true,
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!returns.length) {
      return res.json({
        success: true,
        message: "No returns found",
        returns: [],
      });
    }

    // Map results to a clear structure
    const result = returns.map((ret) => ({
      returnId: ret.id,
      purchaseId: ret.purchaseId,
      product: ret.product,
      quantityReturned: ret.quantity,
      refundAmount: ret.refundAmount,
      purchase: ret.purchase,
      returnedAt: ret.createdAt,
    }));

    res.json({
      success: true,
      message: `Fetched ${returns.length} returned items`,
      returns: result,
    });
  } catch (error) {
    console.error("Error fetching returns:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      details: error.message,
    });
  }
}
