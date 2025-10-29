import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function updateUserController(request, response) {
  const {
    email,
    firstname,
    lastname,
    username,
    phonenumber,
    password,
    profilepicture,
    role,
  } = request.body;

  try {
    const { id } = request.params;
    if (!id) {
      return response
        .status(400)
        .json({ success: false, message: "Missing user id" });
    }
    const userexists = await prisma.users.findFirst({
      where: { id: id },
    });
    if (!userexists) {
      return response
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const updatedUser = await prisma.users.update({
      where: { id: id },
      data: {
        ...(email && { email }),
        ...(firstname && { firstname }),
        ...(lastname && { lastname }),
        ...(username && { username }),
        ...(phonenumber && { phonenumber }),
        ...(password && { password }),
        ...(profilepicture && { profilepicture }),
        ...(role && { role }),
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstname: true,
        lastname: true,
        phonenumber: true,
        profilepicture: true,
        role: true,
      },
    });

    return response
      .status(200)
      .json({ success: true, message: "user Updated", data: updatedUser });
  } catch (error) {
    console.log("error updating user", error.message);
    return response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
