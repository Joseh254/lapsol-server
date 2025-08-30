import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function SignUpController(request, response) {
  const { email, firstname, lastname, username, phonenumber, password } =
    request.body;

  try {
    const createdUser = await prisma.users.create({
      data: {
        email,
        firstname,
        lastname,
        username,
        phonenumber,
        password,
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
