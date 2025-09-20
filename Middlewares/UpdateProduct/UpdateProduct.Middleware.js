import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function UpdateProductMiddleware(request, response, next) {
  const { productname, price, quantity, details, category } = request.body;
  const { id } = request.params;

  try {
    // Check if the product exists first
    const productExists = await prisma.products.findUnique({
      where: { id },
    });

    if (!productExists) {
      return response
        .status(404)
        .json({ success: false, message: "Product does not exist" });
    }

    // Check for duplicate product name (excluding current product)
    if (productname) {
      const duplicate = await prisma.products.findFirst({
        where: {
          productname,
          id: { not: id }, // exclude current product
        },
      });

      if (duplicate) {
        return response
          .status(400)
          .json({
            success: false,
            message: "A product with that name already exists!",
          });
      }

      if (productname.length < 4) {
        return response.status(400).json({
          success: false,
          message: "Product name must have a minimum of 4 characters",
        });
      }

      if (productname.length > 20) {
        return response.status(400).json({
          success: false,
          message: "Product name must have a maximum of 20 characters",
        });
      }
    }

    if (price !== undefined && price <= 0) {
      return response.status(400).json({
        success: false,
        message: "Price must be greater than 0",
      });
    }

    if (quantity !== undefined && quantity <= 0) {
      return response.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    if (details) {
      if (details.length < 10) {
        return response.status(400).json({
          success: false,
          message: "Details must have at least 10 characters",
        });
      }
      if (details.length > 100) {
        return response.status(400).json({
          success: false,
          message: "Details cannot exceed 100 characters",
        });
      }
    }

    next();
  } catch (error) {
    console.error("Error in update product middleware:", error.message);
    return response
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
}
