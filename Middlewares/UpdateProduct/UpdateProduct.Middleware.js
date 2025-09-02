import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function UpdateProductMiddleware(request, response, next) {
  const { productname, price, quantity, details } = request.body;
  const { id } = request.params;
  try {
    if (productname && productname.length < 4) {
      return response.status(400).json({
        success: false,
        message: "Product name must have a minimum of 4 characters",
      });
    }
    if (productname && productname.length > 20) {
      return response.status(400).json({
        success: false,
        message: "Product name must have a maximum of 20 characters",
      });
    }
    if (price && price == 0) {
      return response
        .status(400)
        .json({ success: false, message: "Price cannot be 0" });
    }
    if (quantity && quantity == 0) {
      return response
        .status(400)
        .json({ success: false, message: "quantity cannot be 0" });
    }
    if (details && details.length < 10) {
      return response.status(400).json({
        success: false,
        message: "Details must be 10 or more characters",
      });
    }
    if (details && details.length > 100) {
      return response.status(400).json({
        success: false,
        message: "Details must not exceed 100 characters",
      });
    }

    const productExists = await prisma.products.findFirst({
      where: { id: id },
    });
    if (!productExists) {
      return response
        .status(400)
        .json({ success: false, message: "Product does not exist" });
    }
    next();
  } catch (error) {
    console.log("error in update product middleware", error.message);
    return response
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
}
