import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function FetchOneCustomerController(request, response) {
  response.send("getting one customer");
}
