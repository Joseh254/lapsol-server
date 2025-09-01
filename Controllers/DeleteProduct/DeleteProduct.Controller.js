import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

export async function DeleteProductController(request,response){
    response.send('deleting product')
}