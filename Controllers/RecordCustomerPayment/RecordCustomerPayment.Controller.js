import { PrismaClient, PaymentMethod } from "@prisma/client";
const prisma = new PrismaClient();

export async function RecordCustomerPaymentController(request, response) {
  try {
    const { saleId, amount, method } = request.body;

    if (!saleId) {
      return response
        .status(400)
        .json({ success: false, message: "Sale ID is required" });
    }

    if (!amount || amount <= 0) {
      return response
        .status(400)
        .json({ success: false, message: "Amount must be greater than 0" });
    }

    if (!method) {
      return response
        .status(400)
        .json({ success: false, message: "Payment method is required" });
    }

    const normalizedMethod = method.toUpperCase();
    const validMethods = Object.keys(PaymentMethod);

    if (!validMethods.includes(normalizedMethod)) {
      return response.status(400).json({
        success: false,
        message: `Invalid payment method. Valid options: ${validMethods.join(", ")}`,
      });
    }

    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
      select: { balance: true },
    });

    if (!sale) {
      return response
        .status(404)
        .json({ success: false, message: "Sale not found" });
    }

    if (amount > sale.balance) {
      return response.status(400).json({
        success: false,
        message: `Payment exceeds balance. Current balance is ${sale.balance}`,
      });
    }

    // Create payment with method
    const payment = await prisma.payment.create({
      data: {
        saleId,
        amount,
        method: normalizedMethod, // use normalized validated method
      },
    });

    // Decrease balance
    await prisma.sale.update({
      where: { id: saleId },
      data: {
        balance: { decrement: amount },
      },
    });

    return response.status(201).json({
      success: true,
      message: `${amount} payment recorded as ${normalizedMethod}`,
      data: payment,
    });
  } catch (error) {
    console.error("Error recording customer payment:", error);
    return response.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
