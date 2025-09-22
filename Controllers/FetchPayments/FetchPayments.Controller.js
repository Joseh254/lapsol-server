import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function FetchPayments(req, res) {
  try {
    const { customerId } = req.query;

    const sales = await prisma.sale.findMany({
      where: {
        AND: [
          customerId ? { customerId } : {},

          // Only include:
          // (1) Non-credit sales with payments
          // (2) Credit sales that have at least one payment
          {
            OR: [
              {
                type: {
                  not: "credit",
                },
              },
              {
                payments: {
                  some: {}, // At least one payment
                },
              },
            ],
          },
        ],
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phonenumber: true,
          },
        },
        saleItems: {
          select: {
            product: { select: { productname: true } },
            quantity: true,
            unitPrice: true,
          },
        },
        payments: {
          select: {
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

    const results = sales.map((s) => {
      const totalSaleAmount = s.total;
      const totalPaid = s.payments.reduce((sum, p) => sum + p.amount, 0);
      const balance = s.balance;

      const productList = s.saleItems.map((item) => ({
        name: item.product.productname,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice,
      }));

      return {
        saleId: s.id,
        customer: {
          id: s.customer.id,
          name: s.customer.name,
          phonenumber: s.customer.phonenumber,
        },
        products: productList,
        total: totalSaleAmount,
        paid: totalPaid,
        balance,
        type: s.type,
        createdAt: s.createdAt,
        payments: s.payments,
      };
    });

    return res.status(200).json({
      success: true,
      message: `Fetched ${results.length} payment(s)`,
      data: results,
    });
  } catch (error) {
    console.error("Error in GetPaymentsWithBalanceController:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
