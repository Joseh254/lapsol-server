import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function UpdateUserMiddleware(request, response, next) {
  const { email, firstname, lastname, username, phonenumber, password } =
    request.body;
  const { id } = request.params;
  const loggedInUser = request.user;
  try {
    if (loggedInUser?.id === id && request.body.role) {
      return response.status(403).json({
        success: false,
        message: "You cannot change your own role.",
      });
    }

    if (firstname && firstname.length < 4) {
      return response.status(400).json({
        success: false,
        message: "first name should be atleast 4 characters",
      });
    }
    if (firstname && firstname.length > 100) {
      return response.status(400).json({
        success: false,
        message: "first name should have a maximum of 100 characters",
      });
    }

    if (lastname && lastname.length < 4) {
      return response.status(400).json({
        success: false,
        message: "last name should be atleast 4 characters",
      });
    }
    if (lastname && lastname.length > 100) {
      return response.status(400).json({
        success: false,
        message: "last name should have a maximum of 100 characters",
      });
    }

    if (username && username.length < 4) {
      return response.status(400).json({
        success: false,
        message: "username should be atleast 4 characters",
      });
    }
    if (username && username.length > 100) {
      return response.status(400).json({
        success: false,
        message: "username should have a maximum of 100 characters",
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
    const userWithPhone = await prisma.users.findFirst({
      where: { phonenumber, NOT: { id } },
    });
    if (phonenumber && userWithPhone) {
      return response.status(400).json({
        success: false,
        message: `user with phone number ${phonenumber} already exists`,
      });
    }

    const userWithEmail = await prisma.users.findFirst({
      where: { email, NOT: { id } },
    });
    if (email && userWithEmail) {
      return response.status(400).json({
        success: false,
        message: `user with  email ${email} exists`,
      });
    }
    next();
  } catch (error) {
    console.log("error in update user middleware", error.message);
    return response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
