import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export async function UpdateProfileMiddleware(request, response, next) {
  const { email, firstname, lastname, username, phonenumber, password } = request.body;

  try {
    // Validate only if the field exists
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return response.status(400).json({ success: false, message: "Invalid email format!" });
    }

    if (phonenumber && phonenumber.length < 10) {
      return response.status(400).json({ success: false, message: "Phone number too short!" });
    }

    // (Optional) Check uniqueness for email/phone if provided
    if (email) {
      const existingEmail = await prisma.users.findUnique({ where: { email } });
      if (existingEmail && existingEmail.id !== request.user.id) {
        return response.status(400).json({ success: false, message: "Email already in use!" });
      }
    }

    if (phonenumber) {
      const existingPhone = await prisma.users.findUnique({ where: { phonenumber } });
      if (existingPhone && existingPhone.id !== request.user.id) {
        return response.status(400).json({ success: false, message: "Phone number already in use!" });
      }
    }

    next();
  } catch (error) {
    console.log("error in updating profile middleware", error.message);
    return response
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
}
