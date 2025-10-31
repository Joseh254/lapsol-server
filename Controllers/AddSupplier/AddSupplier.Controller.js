import { PrismaClient } from "@prisma/client";
import pkg from "@prisma/client";
const {CustomerType}=pkg
const prisma = new PrismaClient();

export async function AddSupplierController(req, res) {
  try {
    const { name, location, details, phonenumber } = req.body;

    // 🔹 Validate required fields
    if (!name || !location) {
      return res.status(400).json({
        success: false,
        message: "Name and location are required",
      });
    }

    // 🔹 Check for unique phone number if provided
    if (phonenumber) {
      const existing = await prisma.customers.findUnique({
        where: { phonenumber },
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Phone number already exists",
        });
      }
    }

    // 🔹 Create supplier
    const supplier = await prisma.customers.create({
      data: {
        name,
        location,
        details: details ?? "",
        phonenumber,
        type: CustomerType.SUPPLIER,
      },
    });

    res.status(201).json({
      success: true,
      message: "Supplier added successfully",
      supplier,
    });
  } catch (error) {
    console.error("Error adding supplier:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      details: error.message,
    });
  }
}
