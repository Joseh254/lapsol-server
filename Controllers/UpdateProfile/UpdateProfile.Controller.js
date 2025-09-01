import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function UpdateProfileController(request, response) {
  const { email, firstname, lastname, username, phonenumber, password } =
    request.body();
}
