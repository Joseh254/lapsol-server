import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

export async function AddProductsController(request,response){
    response.send('adding products')
}