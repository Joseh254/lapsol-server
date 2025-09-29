import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function FetchPurchaseController(req, res) {
  try {
    const { id } = req.query;

    if (id) {
      // Fetch specific purchase by ID
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
          purchaseReturns: true,
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

    // Fetch all purchases
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
        items: true,
        payments: true,
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
