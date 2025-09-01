import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function LogoutController(request, response) {
  const refreshToken = request.cookies.refresh_token;

  if (refreshToken) {
    await prisma.users.updateMany({
      where: { refreshToken },
      data: { refreshToken: null },
    });
  }

  response
    .clearCookie("access_token")
    .clearCookie("refresh_token")
    .json({ success: true, message: "Logged out successfully" });
}
