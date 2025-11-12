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
    // Find user by refresh token in the RefreshToken table
    const tokenRecord = await prisma.refreshToken.findFirst({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord) {
      return response
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });
    }

    // Verify refresh token
    try {
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return response
        .status(403)
        .json({ success: false, message: "Expired or invalid refresh token" });
    }

    const user = tokenRecord.user;

    const payload = {
      id: user.id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      phonenumber: user.phonenumber,
      role: user.role,
    };

    // Issue new access token (short-lived)
    const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15m",
      algorithm: "HS256",
    });

    // Optional: rotate refresh token (new long-lived token)
    const newRefreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
        algorithm: "HS256",
      },
    );

    // Save new refresh token in DB and delete old one
    await prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: {
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Set cookies
    response.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    response.cookie("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return response.json({ success: true, accessToken: newAccessToken });
  } catch (error) {
    console.error("Error refreshing token:", error.message);
    return response
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
}
