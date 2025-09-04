import { Router } from "express";

const router = Router();
import { RecordCustomerPaymentController } from "../../Controllers/RecordCustomerPayment/RecordCustomerPayment.Controller.js";
import { UserAuth } from "../../Auths/User/UserAuth.js";

router.post("/", UserAuth, RecordCustomerPaymentController);

export default router;
