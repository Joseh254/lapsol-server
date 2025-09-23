import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function FetchPayments(req, res) {
  try {
    const { customerId } = req.query;

    const sales = await prisma.sale.findMany({
      where: {
        AND: [
          customerId ? { customerId } : {},
          {
            OR: [
              { type: { not: "credit" } }, // Non-credit sales
              { payments: { some: {} } }, // Credit sales with at least one payment
            ],
          },
        ],
      },
      include: {
        customer: { select: { id: true, name: true, phonenumber: true } },
        saleItems: {
          select: {
            product: { select: { productname: true } },
            quantity: true,
            unitPrice: true,
          },
        },
        payments: { select: { amount: true, method: true, createdAt: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const results = sales.map((s) => {
      const totalSaleAmount = s.total;
      const totalPaid = s.payments.reduce((sum, p) => sum + p.amount, 0);
      const balance = s.balance;

      return {
        saleId: s.id,
        customer: {
          id: s.customer.id,
          name: s.customer.name,
          phonenumber: s.customer.phonenumber,
        },
        products: s.saleItems.map((item) => ({
          name: item.product.productname,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice,
        })),
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
      message: `Fetched ${results.length} payment(s) successfully`,
      data: results,
    });
  } catch (error) {
    console.error("❌ Error in FetchPayments:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching payments",
    });
  }
}
