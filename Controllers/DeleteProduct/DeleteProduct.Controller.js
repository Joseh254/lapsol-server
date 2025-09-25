import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function DeleteProductController(request, response) {
  const { id } = request.params;

  try {
    if (!id) {
      return response
        .status(400)
        .json({ success: false, message: "Select a product to delete" });
    }

    const productExists = await prisma.products.findUnique({
      where: { id },
      include: {
        saleItems: true,
        purchaseItems: true,
        productReturns: true,
      },
    });

    if (!productExists) {
      return response
        .status(404)
        .json({ success: false, message: "Product not found!" });
    }

    // 🔒 Prevent deletion if product is referenced anywhere
    if (
      productExists.saleItems.length > 0 ||
      productExists.purchaseItems.length > 0 ||
      productExists.productReturns.length > 0
    ) {
      return response.status(400).json({
        success: false,
        message:
          "Cannot delete product because it has sales, purchases, or returns history.",
      });
    }

    await prisma.products.delete({ where: { id } });

    return response.status(200).json({
      success: true,
      message: `${productExists.productname} deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting product", error.message);
    return response
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
}
