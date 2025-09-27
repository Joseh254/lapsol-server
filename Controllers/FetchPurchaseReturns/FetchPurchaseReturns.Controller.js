import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Fetch purchase returns with detailed breakdown
 * Query param: customerId (optional)
 */
export async function FetchPurchaseReturns(req, res) {
  try {
    const { customerId } = req.query;

    // Dynamic filter
    const whereCondition = customerId ? { purchase: { customerId } } : {};

    // Fetch returns with purchase and product details
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
            items: {
              select: {
                productId: true,
                quantity: true,
                unitPrice: true,
                product: {
                  select: {
                    productname: true,
                    category: true,
                  },
                },
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
      orderBy: { createdAt: "desc" },
    });

    if (!returns.length) {
      return res.json({
        success: true,
        message: "No returns found",
        returns: [],
        totalOwed: 0,
      });
    }

    // Aggregate returns per purchase
    const purchasesMap = {};
    let totalOwed = 0;

    returns.forEach((ret) => {
      const purchaseId = ret.purchaseId;
      if (!purchasesMap[purchaseId]) {
        purchasesMap[purchaseId] = {
          purchaseId,
          type: ret.purchase.type,
          supplier: ret.purchase.supplier,
          createdAt: ret.purchase.createdAt,
          total: ret.purchase.total,
          balance: ret.purchase.balance,
          totalOwed: ret.purchase.type === "credit" ? ret.purchase.balance : 0,
          products: {},
        };
      }

      const prodId = ret.productId;
      if (!purchasesMap[purchaseId].products[prodId]) {
        // Find original quantity purchased
        const purchaseItem = ret.purchase.items.find(
          (item) => item.productId === prodId,
        );
        const purchasedQty = purchaseItem ? purchaseItem.quantity : 0;
        const unitPrice = purchaseItem ? purchaseItem.unitPrice : 0;

        purchasesMap[purchaseId].products[prodId] = {
          product: ret.product,
          quantityPurchased: purchasedQty,
          quantityReturned: 0,
          remainingQty: purchasedQty,
          unitPrice,
          totalPaid: purchasedQty * unitPrice,
          totalRefunded: 0,
        };
      }

      // Add this return
      purchasesMap[purchaseId].products[prodId].quantityReturned +=
        ret.quantity;
      purchasesMap[purchaseId].products[prodId].remainingQty -= ret.quantity;
      purchasesMap[purchaseId].products[prodId].totalRefunded +=
        ret.refundAmount;
    });

    // Flatten products per purchase
    const result = Object.values(purchasesMap).map((purchase) => {
      totalOwed += purchase.totalOwed;
      return {
        purchaseId: purchase.purchaseId,
        type: purchase.type,
        supplier: purchase.supplier,
        createdAt: purchase.createdAt,
        total: purchase.total,
        balance: purchase.balance,
        totalOwed: purchase.totalOwed,
        products: Object.values(purchase.products),
      };
    });

    res.json({
      success: true,
      message: `Fetched ${returns.length} returned items across ${result.length} purchases`,
      returns: result,
      totalOwed,
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
