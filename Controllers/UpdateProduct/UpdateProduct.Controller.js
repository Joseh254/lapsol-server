import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function UpdateProductController(request, response) {
  response.send("updating product");
}
