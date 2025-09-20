import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function UpdateProductController(request, response) {
  const { productname, price, quantity, details, category } = request.body;
  const { id } = request.params;
  try {
    if (!id) {
      return response
        .status(400)
        .json({ success: false, message: "product id is missing" });
    }
    const updatedProduct = await prisma.products.update({
      where: { id: id },
      data: {
        ...(productname && { productname }),
        ...(price && { price }),
        ...(quantity && { quantity }),
        ...(details && { details }),
        ...(category && { category }),
      },
      select: {
        id: true,
        productname: true,
        price: true,
        details: true,
        quantity: true,
        category: true,
      },
    });
    return response.status(200).json({
      success: true,
      message: `${updatedProduct.productname} updated succesfully`,
    });
  } catch (error) {
    console.log("error updating product", error.message);
    return response
      .status(500)
      .json({ success: false, message: "internal server error!" });
  }
}
