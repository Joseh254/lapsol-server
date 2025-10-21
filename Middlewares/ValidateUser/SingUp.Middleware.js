import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function ValidateUserMiddleware(request, response, next) {
  const { email, firstname, lastname, username, phonenumber, password, role } =
    request.body;

  try {
    // Validate that all fields are provided
    if (
      !email ||
      !firstname ||
      !lastname ||
      !username ||
      !phonenumber ||
      !password ||
      !role
    ) {
      return response.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return response.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Validate length of fields
    if (firstname.length < 3 || firstname.length > 50) {
      return response.status(400).json({
        success: false,
        message: "first name must be between 3 and 50 characters",
      });
    }

    if (lastname.length < 3 || lastname.length > 50) {
      return response.status(400).json({
        success: false,
        message: "Last name must be between 3 and 50 characters",
      });
    }

    if (username.length < 3 || username.length > 50) {
      return response.status(400).json({
        success: false,
        message: "Username must be between 3 and 50 characters",
      });
    }

    // Phone number validation
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
    const userWithPhoneExists = await prisma.users.findFirst({
      where: { phonenumber: phonenumber },
    });
    if (userWithPhoneExists) {
      return response.status(500).json({
        success: false,
        message: "User with phone number already exists!",
      });
    }
    // Password validation for complexity
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return response.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long, include at least one lowercase letter, one uppercase letter, and one special character.",
      });
    }

    // Check if email already exists in the database
    const userWithEmailExists = await prisma.users.findFirst({
      where: { email },
    });
    if (userWithEmailExists) {
      return response.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Proceed to the next middleware or controller if validation passes
    next();
  } catch (error) {
    console.log("Error validating user inputs in middleware", error);
    return response.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
}
