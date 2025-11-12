import { PrismaClient } from "@prisma/client";
import pkg from "@prisma/client";
const {CustomerType}=pkg
const prisma = new PrismaClient();

export async function FetchSuppliersController(req, res) {
  try {
    const { id } = req.query;

    // --- Helper function to compute total balance ---
    const calculateBalance = (purchases) =>
      purchases.reduce((sum, p) => sum + p.balance, 0);

    // --- Fetch single supplier by ID ---
    if (id) {
      const supplier = await prisma.customers.findFirst({
        where: {
          id,
          type: { in: [CustomerType.SUPPLIER, CustomerType.BOTH] },
        },
        include: {
          
          purchases: {
            include: {
              items: {
                include: {
                  product: true,
                },
              },
              payments: true,
              purchaseReturns: {
                include: {
                  product: true,
                },
              },
            },
          },
          sales: {
            include: {
              saleItems: {
                include: {
                  product: true,
                },
              },
              payments: true,
              productReturns: {
                include: {
                  product: true,
                },
              },
            },
          },
          productReturns: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!supplier) {
        return res.status(404).json({
          success: false,
          message: "Supplier not found",
        });
      }

      const totalBalance = calculateBalance(supplier.purchases);

      return res.json({
        success: true,
        message: "Supplier fetched successfully",
        supplier: {
          ...supplier,
          balance: totalBalance,
        },
      });
    }

    // --- Fetch all suppliers with full details ---
    const suppliers = await prisma.customers.findMany({
      where: {
        type: { in: [CustomerType.SUPPLIER, CustomerType.BOTH] },
      },
      orderBy: { name: "asc" },
      include: {
        purchases: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
            payments: true,
            purchaseReturns: {
              include: {
                product: true,
              },
            },
          },
        },
        sales: {
          include: {
            saleItems: {
              include: {
                product: true,
              },
            },
            payments: true,
            productReturns: {
              include: {
                product: true,
              },
            },
          },
        },
        productReturns: {
          include: {
            product: true,
          },
        },
      },
    });

    const suppliersWithBalance = suppliers.map((supplier) => ({
      ...supplier,
      balance: calculateBalance(supplier.purchases),
    }));

    res.json({
      success: true,
      message: `Fetched ${suppliersWithBalance.length} suppliers`,
      suppliers: suppliersWithBalance,
    });
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      details: error.message,
    });
  }
}
