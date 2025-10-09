import { PrismaClient, PaymentMethod } from "@prisma/client";
const prisma = new PrismaClient();

export async function recordPurchasePaymentService({
  purchaseId,
  amount,
  method,
}) {
  if (!purchaseId) throw new Error("Purchase ID is required");
  if (!amount || amount <= 0) throw new Error("Amount must be greater than 0");
  if (!method) throw new Error("Payment method is required");

  const normalizedMethod = method.toUpperCase();
  const validMethods = Object.keys(PaymentMethod);

  if (!validMethods.includes(normalizedMethod)) {
    throw new Error(
      `Invalid payment method. Valid options: ${validMethods.join(", ")}`,
    );
  }

  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
    select: { balance: true },
  });

  if (!purchase) throw new Error("Purchase not found");

  // 💡 Don't block payments when balance = 0
  if (purchase.balance === 0 && normalizedMethod !== "CREDIT") {
    console.warn(
      "Warning: Purchase has no balance, but payment is still recorded.",
    );
  }

  // ✅ Use `purchasepayment` model instead of `payment`
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
      data: { balance: { decrement: amount } },
      select: { id: true, balance: true },
    }),
  ]);

  return {
    payment,
    updatedPurchase,
    message: `Payment of ${amount} recorded successfully as ${normalizedMethod}`,
  };
}
