import { PrismaClient } from "@prisma/client";
import { use } from "react";
const prisma = new PrismaClient();

export default async function UpdateProfileMiddleware(request, response, next) {
  const { email, firstname, lastname, username, phonenumber, password } =
    request.body();
  try {
    if (
      !email ||
      !firstname ||
      !lastname ||
      !username ||
      !phonenumber ||
      !password
    ) {
      return response
        .status(400)
        .json({ success: false, message: "All fields are required!" });
    }
  } catch (error) {
    console.log("error in updating profile middleware", error.message);
    return response
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
}
// validate if user is loged in
// no empty fields
//proper lenth and good email format
//proper phone number and dont exist in another user
