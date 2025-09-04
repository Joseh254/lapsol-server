import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function FetchAllCustomersController(request, response) {
  response.send("fetching all customers");
}
