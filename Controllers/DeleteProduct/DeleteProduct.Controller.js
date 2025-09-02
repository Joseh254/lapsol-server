import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function DeleteProductController(request, response) {
  const { id } = request.params;
  try {
    const productExists = await prisma.products.findFirst({
      where: { id: id },
    });
    if (!productExists) {
      return response
        .status(400)
        .json({ success: false, message: "Product not found!" });
    }
    await prisma.products.delete({ where: { id: id } });
    response
      .status(200)
      .json({ success: true, message: `${productExists.productname} deleted` });
  } catch (error) {
    console.log("error deleting product", error.message);
    return response
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
}
