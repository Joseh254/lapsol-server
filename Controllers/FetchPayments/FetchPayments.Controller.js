import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function FetchPayments(req, res) {
  try {
    const { customerId, mode = "flat" } = req.query;

    const sales = await prisma.sale.findMany({
      where: {
        AND: [
          customerId ? { customerId } : {},
          {
            OR: [
              { type: { not: "credit" } }, // Non-credit
              { payments: { some: {} } }, // Or credit with some payments
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
        payments: {
          select: {
            amount: true,
            method: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // --- MODE: FLAT ---
    if (mode === "flat") {
      const flatPayments = [];

      sales.forEach((sale) => {
        sale.payments.forEach((payment) => {
          flatPayments.push({
            amount: payment.amount,
            method: payment.method,
            date: payment.createdAt,

            customer: sale.customer,
            saleId: sale.id,
            saleDate: sale.createdAt,
          });
        });
      });

      const total = flatPayments.reduce((sum, p) => sum + p.amount, 0);

      return res.status(200).json({
        success: true,
        message: `Fetched ${flatPayments.length} payment(s) successfully`,
        totalPayments: total,
        data: flatPayments,
      });
    }

    // --- MODE: FULL ---
    const fullResults = sales.map((s) => {
      const totalPaid = s.payments.reduce((sum, p) => sum + p.amount, 0);

      return {
        saleId: s.id,
        customer: s.customer,
        products: s.saleItems.map((item) => ({
          name: item.product.productname,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice,
        })),
        total: s.total,
        paid: totalPaid,
        balance: s.balance,
        type: s.type,
        createdAt: s.createdAt,
        payments: s.payments,
      };
    });

    return res.status(200).json({
      success: true,
      message: `Fetched ${fullResults.length} sale(s) with payments successfully`,
      data: fullResults,
    });
  } catch (error) {
    console.error("❌ Error in FetchPayments:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching payments",
    });
  }
}
