import { Router } from "express";

import { UserAuth } from "../../Auths/User/UserAuth.js";
import { ReturnPurchase } from "../../Controllers/ReturnPurchase/ReturnPurchase.Controller.js";
const router = Router();
router.post("/", UserAuth, ReturnPurchase);

export default router;
