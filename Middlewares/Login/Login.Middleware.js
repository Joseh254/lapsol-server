import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export function loginMiddleware(request, response, next) {
  const { email, password } = request.body;
  try {
    if (!email || !password) {
      return response
        .status(400)
        .json({ success: false, message: "email and password are required" });
    }
    next();
  } catch (error) {
    console.log("error login middleware", error.message);
    return response
      .status(500)
      .json({ success: false, message: "internal server error!" });
  }
}
