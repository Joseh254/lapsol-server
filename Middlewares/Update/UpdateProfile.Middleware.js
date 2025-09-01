import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export async function UpdateProfileMiddleware(request, response, next) {
  const { email, firstname, lastname, username, phonenumber, password } = request.body;

  try {
    // Validate only if the field exists
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return response.status(400).json({ success: false, message: "Invalid email format!" });
    }

    if (phonenumber && phonenumber.length !== 10) {
      return response.status(400).json({ success: false, message: "Invalid Phone number!" });
    }

    // (Optional) Check uniqueness for email/phone if provided
    if (email) {
      const existingEmail = await prisma.users.findUnique({ where: { email } });
      if (existingEmail && existingEmail.id !== request.user.id) {
        return response.status(400).json({ success: false, message: "Email already in use!" });
      }
    }

       const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (password && !passwordRegex.test(password)) {
      return response.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long, include at least one lowercase letter, one uppercase letter, and one special character.",
      });
    }

    if (phonenumber) {
      const existingPhone = await prisma.users.findUnique({ where: { phonenumber } });
      if (existingPhone && existingPhone.id !== request.user.id) {
        return response.status(400).json({ success: false, message: "Phone number already in use!" });
      }
    }
    if (lastname && lastname.length < 4 || lastname.length>20) {
      return response.status(400).json({
        success: false,
        message: "Last name must be between 4 and 20 characters",
      });
    }
        if (firstname && firstname.length < 4 || firstname.length>20) {
      return response.status(400).json({
        success: false,
        message: "first name must be between 4 and 20 characters",
      });
    }
      if (username && username.length < 5 || username.length > 20) {
      return response.status(400).json({
        success: false,
        message: "Username must be between 5 and 20 characters",
      });
    }

    next();
  } catch (error) {
    console.log("error in updating profile middleware", error.message);
    return response
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
}
