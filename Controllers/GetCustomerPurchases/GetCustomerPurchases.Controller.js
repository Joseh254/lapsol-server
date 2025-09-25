import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GetCustomerPurchases(req, res) {
  try {
    const { customerId } = req.params;

    if (!customerId) {
      return res
        .status(400)
        .json({ success: false, message: "Customer ID is required" });
    }

    // Fetch customer details and purchases
    const customer = await prisma.customers.findUnique({
      where: { id: customerId },
      include: {
        purchases: {
          include: {
            items: {
              include: {
                product: true, // Get product details
              },
            },
            payments: true, // Payment history
          },
        },
      },
    });

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    // Compute total balance per purchase
    const purchaseSummary = customer.purchases.map((purchase) => ({
      purchaseId: purchase.id,
      type: purchase.type,
      total: purchase.total,
      balance: purchase.balance,
      createdAt: purchase.createdAt,
      items: purchase.items.map((item) => ({
        productId: item.product.id,
        productName: item.product.productname,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.quantity * item.unitPrice,
      })),
      payments: purchase.payments.map((payment) => ({
        amount: payment.amount,
        method: payment.method,
        createdAt: payment.createdAt,
      })),
    }));

    // Sum all balances for this customer
    const totalBalance = customer.purchases.reduce(
      (acc, purchase) => acc + purchase.balance,
      0,
    );

    res.json({
      success: true,
      customer: {
        id: customer.id,
        name: customer.name,
        location: customer.location,
        type: customer.type,
      },
      totalBalance,
      purchases: purchaseSummary,
    });
  } catch (error) {
    console.error("Error fetching customer purchases:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching customer purchases",
      details: error.message,
    });
  }
}
