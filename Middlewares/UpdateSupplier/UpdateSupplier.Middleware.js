import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function UpdateSupplierrMiddleware(request, response, next) {
  const { name, location, details, phonenumber } = request.body;
  try {
    if (name && name.length < 4) {
      return response.status(400).json({
        success: false,
        message: "Supplier name should be atleast 4 characters",
      });
    }
    if (name && name.length > 40) {
      return response.status(400).json({
        success: false,
        message: "Supplier name should have not more than 40 characters",
      });
    }

    if (location && location.length < 3) {
      return response.status(400).json({
        success: false,
        message: "location must  be atleast 3 characters",
      });
    }
    if (location && location.length > 40) {
      return response.status(400).json({
        success: false,
        message: "location should have not more than 40 characters",
      });
    }
    if (details && details.length < 10) {
      return response.status(400).json({
        success: false,
        message: "details must  be atleast 10 characters",
      });
    }
    if (details && details.location > 40) {
      return response.status(400).json({
        success: false,
        message: "details should have not more than 40 characters",
      });
    }

    if (
      phonenumber &&
      !phonenumber.startsWith("07") &&
      phonenumber &&
      !phonenumber.startsWith("01")
    ) {
      return response.status(400).json({
        success: false,
        message: "Phone number must start with 07 or 01",
      });
    }

    if (phonenumber && phonenumber.length !== 10) {
      return response.status(400).json({
        success: false,
        message: "Phone number must be exactly 10 digits",
      });
    }

    const supplierWithPhone = await prisma.customers.findFirst({
      where: { phonenumber },
    });
    if (phonenumber && supplierWithPhone) {
      return response.status(400).json({
        success: false,
        message: "phone number already taken",
      });
    }
    next();
  } catch (error) {
    console.log("error updating customer middleware", error.message);
  }
}
