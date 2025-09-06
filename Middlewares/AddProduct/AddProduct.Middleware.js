import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function AddProductMiddleware(request, response, next) {
  const { productname, price, quantity, details,category } = request.body;
  try {
    //validate fields
    if (!productname || !price || !quantity || !details || !category) {
      return response
        .status(400)
        .json({ success: false, message: "All product fields are required" });
    }
    // validate if similar product exists
    const productWithTheNameExists = await prisma.products.findFirst({
      where: { productname },
    });
    if (productWithTheNameExists) {
      return response.status(400).json({
        success: false,
        message: "Product with the name already exists",
      });
    }
    //validate length
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
    if (details.length < 10) {
      return response.status(400).json({
        success: false,
        message: "Product details must have a minimum of 10 characters",
      });
    }
    if (details.length > 100) {
      return response.status(400).json({
        success: false,
        message: "Product details must have a maximum of 100 characters",
      });
    }
    if (quantity === 0) {
      return response
        .status(400)
        .json({ success: false, message: "Product quantity cannot be 0" });
    }
    if (price === 0) {
      return response
        .status(400)
        .json({ success: false, message: "Product price cannot be 0" });
    }

    next();
  } catch (error) {
    console.log("error in adding product middleware", error.message);
    return response
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
}
