import { PrismaClient } from "@prisma/client";
import pkg from "@prisma/client";
const {CustomerType}=pkg
const prisma = new PrismaClient();


export async function deleteSupplierController(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Supplier ID is required",
      });
    }

    // Fetch the supplier and their purchases
    const supplier = await prisma.customers.findUnique({
      where: { id },
      include: {
        purchases: {
          select: { balance: true },
        },
      },
    });

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    // Check if they are a SUPPLIER or BOTH
    if (![CustomerType.SUPPLIER, CustomerType.BOTH].includes(supplier.type)) {
      return res.status(400).json({
        success: false,
        message: "Customer is not a supplier",
      });
    }

    // Calculate total balance
    const totalBalance = supplier.purchases.reduce(
      (sum, p) => sum + p.balance,
      0,
    );

    if (totalBalance !== 0) {
      return res.status(400).json({
        success: false,
        message: `Supplier cannot be deleted. Outstanding balance: ${totalBalance}`,
      });
    }

    // Delete the supplier
    await prisma.customers.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: "Supplier deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting supplier:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      details: error.message,
    });
  }
}
