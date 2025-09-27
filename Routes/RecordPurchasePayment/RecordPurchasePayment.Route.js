import { Router } from "express";

import { UserAuth } from "../../Auths/User/UserAuth.js";
import { RecordPurchasePaymentController } from "../../Controllers/RecordPurchasePayment/RecordPurchasePayment.Controller.js";

const router = Router();
router.post("/", UserAuth, RecordPurchasePaymentController);
export default router;
