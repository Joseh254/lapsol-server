import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function UpdateProfileController(request, response) {
  const { email, firstname, lastname, username, phonenumber, password } =
    request.body;

    try {
        const {id } = request.params
        const user = await prisma.users.findUnique({where:{id:id}})
        if( !user){return response.status(400).json({success:false,message:"User not found"})}
        const updateduser = await prisma.users.update({
            where:{id:id},
            data:{
                email:email || user.email,
                phonenumber: phonenumber || user.phonenumber,
                firstname:firstname || user.firstname,
                lastname:lastname || user.lastname,
                username: username || user.username,
                password: password|| user.password
            }
        
        })
        response.send(updateduser)

    } catch (error) {
        console.log('error updating profile',error.message);
        return response.status(500).json({success:false, message:"Internal server error!"})
        
    }
}
