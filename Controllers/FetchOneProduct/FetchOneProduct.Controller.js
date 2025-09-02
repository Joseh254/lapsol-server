import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function FetchOneProductController(request, response) {
  response.send("getting one product");
}
