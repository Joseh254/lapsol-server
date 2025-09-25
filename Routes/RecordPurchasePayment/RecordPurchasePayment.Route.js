import { Router } from "express";
import { RecordPurchasePaymentController } from "../../Controllers/RecordPurchasePayment/RecordPurchasePayment.Controller.js";

const router = Router()
router.post('/',RecordPurchasePaymentController)
export default router;