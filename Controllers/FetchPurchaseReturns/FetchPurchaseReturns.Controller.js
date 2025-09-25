import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Fetch all returns for a given supplier/customer
 * Query params: customerId (optional) or supplierId
 */
export async function FetchPurchaseReturns(req, res) {
  try {
    const { customerId } = req.query;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "customerId is required to fetch returns",
      });
    }

    // Fetch all purchasereturn records for this customer
    const returns = await prisma.purchasereturn.findMany({
      where: {
        purchase: {
          customerId, // fetch returns for purchases linked to this customer/supplier
        },
      },
      include: {
        purchase: {
          select: {
            id: true,
            type: true,
            total: true,
            balance: true,
            createdAt: true,
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
        message: "No returns found for this customer",
        returns: [],
      });
    }

    // Aggregate totals per purchase
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
