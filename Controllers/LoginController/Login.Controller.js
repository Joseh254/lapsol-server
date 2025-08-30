import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function LoginController(request, response) {
  const { email, password } = request.body;

  try {
    const userExists = await prisma.users.findFirst({
      where: { email },
    });

    if (!userExists) {
      return response
        .status(404)
        .json({ success: false, message: "Wrong credentials!" });
    }

    const passwordMatch = await bcrypt.compare(password, userExists.password);
    if (!passwordMatch) {
      return response
        .status(400)
        .json({ success: false, message: "Wrong credentials" });
    }

    const payload = {
      id: userExists.id,
      username: userExists.username,
      firstname: userExists.firstname,
      lastname: userExists.lastname,
      phonenumber: userExists.phonenumber,
      role: userExists.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
      algorithm: "HS256",
    });

    response
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .json({
        success: true,
        message: "Logged in successfully",
        data: payload,
      });

  } catch (error) {
    console.error("Error logging in user:", error.message);
    return response
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
}
