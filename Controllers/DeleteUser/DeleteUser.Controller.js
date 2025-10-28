import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function deleteUserController(request, response) {
  response.send("deleting user");
}
