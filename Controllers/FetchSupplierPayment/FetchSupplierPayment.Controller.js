import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function FetchSupplierPayments(req, res) {
  try {
    const { supplierId, mode = "flat" } = req.query;

    const purchases = await prisma.purchase.findMany({
      where: {
        AND: [
          supplierId ? { customerId: supplierId } : {},
          {
            OR: [
              { type: { not: "credit" } }, // Not credit
              { payments: { some: {} } }, // OR credit with at least one payment
            ],
          },
        ],
      },
      include: {
        supplier: {
          select: { id: true, name: true, phonenumber: true },
        },
        items: {
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

    // --- FLAT MODE ---
    if (mode === "flat") {
      const flatPayments = [];

      purchases.forEach((purchase) => {
        purchase.payments.forEach((payment) => {
          flatPayments.push({
            amount: payment.amount,
            method: payment.method,
            date: payment.createdAt,

            supplier: purchase.supplier,
            purchaseId: purchase.id,
            purchaseDate: purchase.createdAt,
          });
        });
      });

      const total = flatPayments.reduce((sum, p) => sum + p.amount, 0);

      return res.status(200).json({
        success: true,
        message: `Fetched ${flatPayments.length} supplier payment(s) successfully`,
        totalPayments: total,
        data: flatPayments,
      });
    }

    // --- FULL MODE ---
    const fullResults = purchases.map((p) => {
      const totalPaid = p.payments.reduce((sum, pay) => sum + pay.amount, 0);

      return {
        purchaseId: p.id,
        supplier: p.supplier,
        products: p.items.map((item) => ({
          name: item.product.productname,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice,
        })),
        total: p.total,
        paid: totalPaid,
        balance: p.balance,
        type: p.type,
        createdAt: p.createdAt,
        payments: p.payments,
      };
    });

    return res.status(200).json({
      success: true,
      message: `Fetched ${fullResults.length} purchase(s) with supplier payments successfully`,
      data: fullResults,
    });
  } catch (error) {
    console.error("❌ Error in FetchSupplierPayments:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching supplier payments",
    });
  }
}
