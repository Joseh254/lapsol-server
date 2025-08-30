import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

export async function SignUpController(request, response) {
  const { email, firstname, lastname, username, phonenumber, password} =
    request.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const createdUser = await prisma.users.create({
      data: {
        email,
        firstname,
        lastname,
        username,
        phonenumber,
        password: hashedPassword,
    
      },
      select: {
        email: true,
        firstname: true,
        lastname: true,
        username: true,
        phonenumber: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    response.status(200).json({
      success: true,
      message: "Account created successfully!",
      data: createdUser,
    });
  } catch (error) {
    console.error("signup error:", error.message);
    return response.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
