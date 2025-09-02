import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function FetchAllProductsController(request, response) {
  try {
    const products = await prisma.products.findMany();
    if (products.length == 0) {
      return response
        .status(404)
        .json({ success: false, message: "No products found" });
    }
    return response.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("error fetching all products", error.message);
    response
      .status(500)
      .json({ success: false, messgae: "internal server error!" });
  }
}
