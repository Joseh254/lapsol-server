import { PrismaClient, PaymentMethod } from "@prisma/client";
const prisma = new PrismaClient();

export async function RecordPurchasePaymentController(req, res) {
  try {
    const { purchaseId, amount, method } = req.body;

    // 🔹 Validate input
    if (!purchaseId) {
      return res.status(400).json({
        success: false,
        message: "Purchase ID is required",
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    if (!method) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required",
      });
    }

    // 🔹 Normalize and validate payment method
    const normalizedMethod = method.toUpperCase();
    const validMethods = Object.keys(PaymentMethod);

    if (!validMethods.includes(normalizedMethod)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment method. Valid options: ${validMethods.join(", ")}`,
      });
    }

    // 🔹 Get the purchase and check balance
    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
      select: { balance: true },
    });

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    if (amount > purchase.balance) {
      return res.status(400).json({
        success: false,
        message: `Payment exceeds balance. Current balance is ${purchase.balance}`,
      });
    }

    // 🔹 Transaction: record payment + update balance
    const [payment, updatedPurchase] = await prisma.$transaction([
      prisma.purchasepayment.create({
        data: {
          purchaseId,
          amount,
          method: normalizedMethod,
        },
      }),
      prisma.purchase.update({
        where: { id: purchaseId },
        data: {
          balance: { decrement: amount },
        },
        select: { id: true, balance: true },
      }),
    ]);

    return res.status(201).json({
      success: true,
      message: `Payment of ${amount} recorded successfully as ${normalizedMethod}`,
      data: {
        payment,
        updatedPurchase,
      },
    });
  } catch (error) {
    console.error("❌ Error recording purchase payment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while recording purchase payment",
      details: error.message,
    });
  }
}
