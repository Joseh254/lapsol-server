import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function deleteUserController(request, response) {
  const { id } = request.params;

  try {
    // 1. Check if user exists
    const user = await prisma.users.findUnique({
      where: { id },
      include: { sales: true, purchases: true, refreshTokens: true },
    });

    if (!user) {
      return response
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // 1. Check if user is logged in
    if (request.user.id === id) {
      return response.status(400).json({
        success: false,
        message: "You cannot delete your own account while logged in",
      });
    }

    // 3. Check if superadmin
    if (user.role === "superadmin") {
      return response.status(403).json({
        success: false,
        message: "Cannot delete a superadmin user",
      });
    }
    // 4. Check for related records
    if (
      (user.sale && user.sale.length > 0) ||
      (user.purchases && user.purchases.length > 0) ||
      (user.refreshTokens && user.refreshTokens.length > 0)
    ) {
      return response.status(400).json({
        success: false,
        message:
          "Cannot delete user with existing records (sales, purchases, or tokens)",
      });
    }

    // 5. Safe to delete
    await prisma.users.delete({ where: { id } });

    return response.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return response
      .status(500)
      .json({ success: false, message: "Server error" });
  }
}
