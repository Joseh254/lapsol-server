import { recordCustomerPaymentService } from "../../Services/RecordPayment/RecordCustomerPaymentService.js";

export async function RecordCustomerPaymentController(req, res) {
  try {
    const result = await recordCustomerPaymentService(req.body);
   
    
    return res.status(201).json(result,);
  } catch (error) {
    console.error("❌ Error recording customer payment:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to record payment",
    });
  }
} 
