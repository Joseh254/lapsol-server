import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function UpdateCustomerMiddleware(request, response, next) {
  const { name, location, details, phonenumber } = request.body;
  const {id } = request.params
  try {
    if(!id){return response.status(404).json({success:false,message:"Id is not provided"})}
    const customerExists = await prisma.customers.findFirst({where:{id}})
    if(!customerExists){return response.status(404).json({success:false,message:"Customer Not found"})}
    if (name && name.length < 4) {
      return response.status(400).json({
        success: false,
        message: "Customer name should be atleast 4 characters",
      });
    }
    if (name && name.length > 40) {
      return response.status(400).json({
        success: false,
        message: "Customer name should have not more than 40 characters",
      });
    }

    if (location && location.length < 4) {
      return response.status(400).json({
        success: false,
        message: "location must  be atleast 4 characters",
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

    next();
  } catch (error) {
    console.log("error updating customer middleware", error.message);
  }
}
