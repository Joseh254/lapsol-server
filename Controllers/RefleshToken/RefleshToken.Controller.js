import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
export async function RefreshTokenController(request, response) {
  const refreshToken = request.cookies.refresh_token;

  if (!refreshToken) {
    return response
      .status(401)
      .json({ success: false, message: "No refresh token" });
  }

  try {
    // Find user by refresh token
    const user = await prisma.users.findFirst({
      where: { refreshToken },
    });

    if (!user) {
      return response
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });
    }

    // Verify refresh token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return response
          .status(403)
          .json({ success: false, message: "Invalid refresh token" });
      }

      const payload = {
        id: user.id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        phonenumber: user.phonenumber,
        role: user.role,
      };

      // Issue new access token
      const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "15m",
        algorithm: "HS256",
      });

      response.cookie("access_token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 370 * 60 * 1000, 
      });

      return response.json({ success: true, accessToken: newAccessToken });
    });
  } catch (error) {
    console.error("Error refreshing token:", error.message);
    return response
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
}
