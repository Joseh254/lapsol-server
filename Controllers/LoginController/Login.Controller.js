import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function LoginController(request, response) {
  const { email, password } = request.body;
  const isProduction = process.env.NODE_ENV === "production";

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
      email: userExists.email,
      profilepicture: userExists.profilepicture,
    };

    // Generate short-lived access token
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15m",
      algorithm: "HS256",
    });

    // Generate long-lived refresh token
    const refreshToken = jwt.sign(
      { id: userExists.id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
        algorithm: "HS256",
      },
    );

    // Store refresh token in DB
    await prisma.users.update({
      where: { id: userExists.id },
      data: { refreshToken },
    });
    response.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: isProduction, // ✅ only true in production
      sameSite: isProduction ? "None" : "Lax", // ✅ safe in dev
      maxAge: 15 * 60 * 1000,
    });

    response.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    response.status(200).json({
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
