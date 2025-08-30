import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient();

export async function LoginController(request, response) {
 const { email, password} = request.body;

 try {
  const userExists = await prisma.users.findFirst({where:{email:email}})
  if(!userExists){return response.status(404).json({success:false, message:"Wrong credentials!"})}
  const passwordMatch = bcrypt.compareSync(password,userExists.password)
  if(!passwordMatch){return response.status(400).json({success:false,message:"Wrong credentials"})}
  else{
    const payload = {
      id:userExists.id,
      username:userExists.username,
      firstname:userExists.firstname,
      lastname:userExists.lastname,
      phonenumber:userExists.phonenumber,
      role:userExists.role,
    }
    const token = jwt.sign(payload,process.env.JWT_SECRET)
    response.cookie('access_token',token).json({success:true,message:"Logged in succesfully",data:payload})
  }
  
 } catch (error) {
  console.log("error loging in user",error.message);
  return response.status(500).json({success:false,message:"Internal server error!"})
  
 }
}
