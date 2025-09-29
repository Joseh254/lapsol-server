import { Router } from "express";
import { FetchSupplierPayments } from "../../Controllers/FetchSupplierPayment/FetchSupplierPayment.Controller.js";
import { UserAuth } from "../../Auths/User/UserAuth.js";

const router = Router();

router.get("/", UserAuth, FetchSupplierPayments);
export default router;
