import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
export async function AddUserController(request, response) {
  const { firstname, lastname, email, username, phonenumber, password, role } =
    request.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await prisma.users.create({
      data: {
        firstname,
        lastname,
        username,
        email,
        password: hashedPassword,
        role,
        phonenumber,
      },
      select: {
        firstname: true,
        lastname: true,
        username: true,
        email: true,
        role: true,
        phonenumber: true,
      },
    });

    response
      .status(201)
      .json({ success: true, data: newUser, message: "User added" });
  } catch (error) {
    console.log("error creating new user", error.message);
    return response
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
}
