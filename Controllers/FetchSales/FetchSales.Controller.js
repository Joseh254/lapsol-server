import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function FetchSalesController(request, response) {
  const { date,id } = request.query;

  try {
    const sales = await prisma.sale.findMany({
           where: {
        ...(id && { id: (id) }), // if id is provided, filter by id
        ...(date && {
          createdAt: {
            gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
            lt: new Date(new Date(date).setHours(23, 59, 59, 999)),
          },
        }),
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phonenumber: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        saleItems: {
          include: {
            product: {
              select: {
                id: true,
                productname: true,
                price: true,
                quantity:true,
                createdAt:true,
              },
            },
          },
        },
        payments: {
          select: {
            id: true,
            amount: true,
            method: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format to your frontend's needs
    const formattedSales = sales.map((sale) => ({
      saleId: sale.id,
      date: sale.createdAt,
      type: sale.type,
      total: sale.total,
      balance: sale.balance,
      customer: sale.customer,
      user: sale.user,
      items: sale.saleItems.map((item) => ({
        product: item.product.productname,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice,
      })),
      payments: sale.payments.map((p) => ({
        id: p.id,
        amount: p.amount,
        method: p.method || "CREDIT", // fallback just in case
        date: p.createdAt,
      })),
    }));

    return response.status(200).json({
      success: true,
      data: formattedSales,
    });
  } catch (error) {
    console.error("Error fetching sales:", error.message);
    return response.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
