import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function PurchaseProductMiddleware(req, res, next) {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "At least one item is required" });
    }

    for (const item of items) {
      if (item.newProduct) {
        const { productname, price, quantity, details, category } =
          item.newProduct;

        // 🔹 productname and price are compulsory
        if (!productname || price === undefined) {
          return res.status(400).json({
            success: false,
            message: "Product name and price are required",
          });
        }

        // 🔹 validate productname
        if (productname.trim().length < 4) {
          return res.status(400).json({
            success: false,
            message: "Product name must have at least 4 characters",
          });
        }
        if (productname.trim().length > 80) {
          return res.status(400).json({
            success: false,
            message: "Product name must not exceed 80 characters",
          });
        }

        // 🔹 validate details only if provided
        if (details && details.trim().length < 10) {
          return res.status(400).json({
            success: false,
            message: "Product details must have at least 10 characters",
          });
        }
        if (details && details.trim().length > 100) {
          return res.status(400).json({
            success: false,
            message: "Product details must not exceed 100 characters",
          });
        }

        // 🔹 validate quantity
        if (quantity !== undefined && quantity <= 0) {
          return res.status(400).json({
            success: false,
            message: "Product quantity must be greater than 0",
          });
        }

        // 🔹 validate price
        if (price <= 0) {
          return res.status(400).json({
            success: false,
            message: "Product price must be greater than 0",
          });
        }
      }
    }

    next();
  } catch (error) {
    console.log("error in purchase product middleware", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
}
