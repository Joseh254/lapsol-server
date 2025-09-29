import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function FetchPurchaseController(req, res) {
  try {
    const { id, userId, supplierId } = req.query;

    // If `id` is provided, fetch that specific purchase
    if (id) {
      const purchase = await prisma.purchase.findUnique({
        where: { id: String(id) },
        include: {
          supplier: {
            select: {
              id: true,
              name: true,
              phonenumber: true,
              location: true,
            },
          },
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              username: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  productname: true,
                  price: true,
                },
              },
            },
          },
          payments: true,
          purchaseReturns: {
            include: {
              product: {
                select: {
                  id: true,
                  productname: true,
                },
              },
            },
          },
        },
      });

      if (!purchase) {
        return res.status(404).json({
          success: false,
          message: "Purchase not found",
        });
      }

      return res.json({
        success: true,
        message: "Purchase fetched successfully",
        purchase,
      });
    }

    // If userId or supplierId is provided (but no purchase id) => filter accordingly
    if (userId || supplierId) {
      // Build a `where` filter object dynamically
      const whereFilter = {};
      if (userId) {
        whereFilter.userId = String(userId);
      }
      if (supplierId) {
        // In your schema, the field is `customerId` in purchase,
        // which links to supplier / customer
        whereFilter.customerId = String(supplierId);
      }

      const filteredPurchases = await prisma.purchase.findMany({
        where: whereFilter,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          supplier: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              username: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  productname: true,
                  price: true,
                },
              },
            },
          },
          payments: true,
          purchaseReturns: {
            include: {
              product: {
                select: {
                  id: true,
                  productname: true,
                },
              },
            },
          },
        },
      });

      return res.json({
        success: true,
        message: `Fetched ${filteredPurchases.length} purchases`,
        purchases: filteredPurchases,
      });
    }

    // Default: fetch all purchases
    const purchases = await prisma.purchase.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                productname: true,
                price: true,
              },
            },
          },
        },
        payments: true,
        purchaseReturns: {
          include: {
            product: {
              select: {
                id: true,
                productname: true,
              },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      message: `Fetched ${purchases.length} purchases`,
      purchases,
    });
  } catch (error) {
    console.error("Error fetching purchases:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      details: error.message,
    });
  }
}
