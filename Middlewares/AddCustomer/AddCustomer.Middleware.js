import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function AddCustomerMiddleware(request, response, next) {
  const { name, location, details, phonenumber } = request.body;
  try {
    if (!name || !location || !details || !phonenumber) {
      return response
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    // validate phone number
    const customerWithPhoneExists = await prisma.customers.findFirst({
      where: { phonenumber: phonenumber },
    });
    if (customerWithPhoneExists) {
      return response.status(400).json({
        success: false,
        message: "A Customer with the phone number exists",
      });
    }
    //validate length
    if (name.length < 4) {
      return response.status(400).json({
        success: false,
        message: "Customer name should be atleast 4 characters",
      });
    }
    if (name.length > 40) {
      return response.status(400).json({
        success: false,
        message: "Customer name should have not more than 40 characters",
      });
    }
    if (location.length < 4) {
      return response.status(400).json({
        success: false,
        message: "location must  be atleast 4 characters",
      });
    }
    if (location.length > 40) {
      return response.status(400).json({
        success: false,
        message: "location should have not more than 40 characters",
      });
    }
    if (details.length < 10) {
      return response.status(400).json({
        success: false,
        message: "details must  be atleast 10 characters",
      });
    }
    if (details.location > 40) {
      return response.status(400).json({
        success: false,
        message: "details should have not more than 40 characters",
      });
    }

    // validate phone

    if (!phonenumber.startsWith("07") && !phonenumber.startsWith("01")) {
      return response.status(400).json({
        success: false,
        message: "Phone number must start with 07 or 01",
      });
    }

    if (phonenumber.length !== 10) {
      return response.status(400).json({
        success: false,
        message: "Phone number must be exactly 10 digits",
      });
    }
    next();
  } catch (error) {
    console.log("error in adding customer middleware", error.message);
    return response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
