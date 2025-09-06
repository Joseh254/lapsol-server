import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function AddProductsController(request, response) {
  const { productname, price, details, quantity,category } = request.body;

  try {
    if (!productname || !price || !details || !quantity || !category) {
      return response
        .status(400)
        .json({ success: false, message: "All product details are required!" });
    }

    const newProduct = await prisma.products.create({
      data: {
        productname,
        price,
        quantity,
        details,
        category
      },
      select: {
        id: true,
        productname: true,
        price: true,
        quantity: true,
        details: true,
        category:true
      },
    });
    response
      .status(201)
      .json({ success: true, message: "Product Added", data: newProduct });
  } catch (error) {
    console.log("error adding products ", error.message);
    return response
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
}
