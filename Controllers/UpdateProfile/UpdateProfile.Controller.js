import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function UpdateProfileController(request, response) {
  const { email, firstname, lastname, username, phonenumber, password } =
    request.body;

    try {
        response.send("sucess up to that point")
    } catch (error) {
        console.log('error updating profile',error.message);
        return response.status(500).json({success:false, message:"Internal server error!"})
        
    }
}
