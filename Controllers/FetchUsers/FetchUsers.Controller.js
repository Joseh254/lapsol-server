import { PrismaClient} from '@prisma/client'
const prisma = new PrismaClient()

export async function FetchUsersController(request,response){
   try {
    const users = await prisma.users.findMany()
    if(users.length===0){return response.status(404).json({success:false,message:"No users Found"})}
    response.status(200).json({success:true,data:users})
    
    
   } catch (error) {
    console.log('error getting users',error.message);
    return response.status(500).json({success:false,message:"Internal server error!"})
    
   }
}