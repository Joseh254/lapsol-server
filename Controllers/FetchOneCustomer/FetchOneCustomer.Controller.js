import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function FetchOneCustomerController(request, response) {
  const { id } = request.params;

  try {
    if (!id) {
      return response
        .status(400)
        .json({ success: false, message: "Customer ID is required" });
    }

    const customer = await prisma.customers.findUnique({
      where: { id },
      include: {
        // 🧾 All sales made to this customer
        sales: {
          include: {
            saleItems: {
              include: { product: true }, // get product details for each sold item
            },
            payments: true, // get all payments for each sale
            productReturns: {
              include: { product: true }, // get details of returned products
            },
          },
        },
        // 📦 All purchases (if this customer is a supplier)
        purchases: {
          include: {
            items: {
              include: { product: true },
            },
            payments: true,
            purchaseReturns: {
              include: { product: true },
            },
          },
        },
        // 🔁 All product returns (directly related)
        productReturns: {
          include: { product: true, sale: true },
        },
      },
    });

    if (!customer) {
      return response
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    // 🧮 Calculate the total balance across all sales & purchases
    const totalSaleBalance = customer.sales.reduce(
      (sum, sale) => sum + (sale.balance || 0),
      0,
    );
    const totalPurchaseBalance = customer.purchases.reduce(
      (sum, purchase) => sum + (purchase.balance || 0),
      0,
    );
    const totalBalance = totalSaleBalance - totalPurchaseBalance;

    response.status(200).json({
      success: true,
      data: {
        ...customer,
        totalBalance,
      },
    });
  } catch (error) {
    console.error("Error getting the customer:", error.message);
    return response
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
}
