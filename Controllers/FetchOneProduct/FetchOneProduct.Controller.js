import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function FetchOneProductController(request, response) {
  const { productname } = request.body;
  try {
    if (!productname) {
      return response.status(400).json({
        success: false,
        message: "Please enter product name you want to seach",
      });
    }
    const searchedProduct = await prisma.products.findFirst({
      where: { productname: productname },
    });
    if (!searchedProduct) {
      return response
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    return response.status(200).json({ success: true, data: searchedProduct });
  } catch (error) {
    console.log("error seaching for one product", error.message);
    return response
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
}
