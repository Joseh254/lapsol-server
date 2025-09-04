import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function RecordCustomerPaymentController(request, response) {
  try {
    const { saleId, amount } = request.body;

    // 1. Find the sale first
    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
      select: { balance: true },
    });

    if (!sale) {
      return response
        .status(404)
        .json({ success: false, message: "Sale not found" });
    }

    // 2. Prevent overpayment
    if (amount > sale.balance) {
      return response.status(400).json({
        success: false,
        message: `Payment exceeds balance. Current balance is ${sale.balance}`,
      });
    }

    // 3. Create payment record
    const payment = await prisma.payment.create({
      data: { saleId, amount },
    });

    // 4. Update sale balance
    await prisma.sale.update({
      where: { id: saleId },
      data: { balance: { decrement: amount } },
    });

    response.status(201).json({
      success: true,
      message: `${amount} payment recorded`,
      data: payment,
    });
  } catch (error) {
    console.log("error recording customer payment", error.message);
    response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
