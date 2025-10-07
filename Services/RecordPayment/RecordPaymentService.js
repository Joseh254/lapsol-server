import { PrismaClient, PaymentMethod } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Records a customer payment and updates the sale balance.
 * Can be reused in CreateSale or RecordCustomerPaymentController.
 */
export async function recordPaymentService({ saleId, amount, method }) {
  if (!saleId) throw new Error("Sale ID is required");
  if (!amount || amount <= 0) throw new Error("Amount must be greater than 0");
  if (!method) throw new Error("Payment method is required");

  const normalizedMethod = method.toUpperCase();
  const validMethods = Object.keys(PaymentMethod);

  if (!validMethods.includes(normalizedMethod)) {
    throw new Error(
      `Invalid payment method. Valid options: ${validMethods.join(", ")}`,
    );
  }

  const sale = await prisma.sale.findUnique({
    where: { id: saleId },
    select: { balance: true },
  });

  if (!sale) throw new Error("Sale not found");

  if (amount > sale.balance) {
    throw new Error(
      `Payment exceeds balance. Current balance is ${sale.balance}`,
    );
  }

  // ✅ Record payment + update sale balance in a transaction
  const [payment, updatedSale] = await prisma.$transaction([
    prisma.payment.create({
      data: {
        saleId,
        amount,
        method: normalizedMethod,
      },
    }),
    prisma.sale.update({
      where: { id: saleId },
      data: { balance: { decrement: amount } },
      select: { id: true, balance: true },
    }),
  ]);

  return {
    payment,
    updatedSale,
    message: `Payment of ${amount} recorded successfully as ${normalizedMethod}`,
  };
}
