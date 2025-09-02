import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function FetchAllProductsController(request, response) {
  response.send("fetchin all products");
}
