import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function FetchCustomerWithBalance(request, response) {
  response.send();
}
