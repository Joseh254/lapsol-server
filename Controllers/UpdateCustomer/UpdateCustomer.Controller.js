import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function UpdateCustomerController(request, response) {
  response.send("updating customer");
}
