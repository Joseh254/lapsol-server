import { PrismaClient, CustomerType } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Fetch suppliers
 * Query param: id (optional) – fetch single supplier if provided
 */
export async function FetchSuppliersController(req, res) {
  try {
    const { id } = req.query;

    if (id) {
      // Fetch single supplier by ID with balance
      const supplier = await prisma.customers.findFirst({
        where: {
          id,
          type: {
            in: [CustomerType.SUPPLIER, CustomerType.BOTH],
          },
        },
        select: {
          id: true,
          name: true,
          location: true,
          details: true,
          phonenumber: true,
          type: true,
          createdAt: true,
          updatedAt: true,
          purchases: {
            select: {
              balance: true,
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

      const totalBalance = supplier.purchases.reduce((sum, p) => sum + p.balance, 0);

      return res.json({
        success: true,
        message: "Supplier fetched successfully",
        supplier: {
          ...supplier,
          balance: totalBalance,
        },
      });
    }

    // Fetch all suppliers with balances
    const suppliers = await prisma.customers.findMany({
      where: {
        type: {
          in: [CustomerType.SUPPLIER, CustomerType.BOTH],
        },
      },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        location: true,
        details: true,
        phonenumber: true,
        type: true,
        createdAt: true,
        updatedAt: true,
        purchases: {
          select: {
            balance: true,
          },
        },
      },
    });

    const suppliersWithBalance = suppliers.map((supplier) => {
      const totalBalance = supplier.purchases.reduce((sum, p) => sum + p.balance, 0);
      return {
        ...supplier,
        balance: totalBalance,
      };
    });

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
