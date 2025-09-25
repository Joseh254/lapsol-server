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
      // Fetch single supplier by ID
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
        },
      });

      if (!supplier) {
        return res.status(404).json({
          success: false,
          message: "Supplier not found",
        });
      }

      return res.json({
        success: true,
        message: "Supplier fetched successfully",
        supplier,
      });
    }

    // Fetch all suppliers
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
      },
    });

    res.json({
      success: true,
      message: `Fetched ${suppliers.length} suppliers`,
      suppliers,
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
