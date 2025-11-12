import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function UpdateProfileController(request, response) {
  const {
    email,
    firstname,
    lastname,
    username,
    phonenumber,
    password,
    profilepicture,
  } = request.body;

  try {
    const updatedUser = await prisma.users.update({
      where: { id: request.user.id },
      data: {
        ...(email && { email }),
        ...(firstname && { firstname }),
        ...(lastname && { lastname }),
        ...(username && { username }),
        ...(phonenumber && { phonenumber }),
        ...(password && { password }),
        ...(profilepicture && { profilepicture }),
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstname: true,
        lastname: true,
        phonenumber: true,
        profilepicture: true,
        role:true
      },
    });

    return response
      .status(200)
      .json({ success: true, message: "Profile Updated", data: updatedUser });
  } catch (error) {
    console.log("Error updating profile:", error.message);
    return response
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
}
