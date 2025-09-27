import { Router } from "express";

import { UserAuth } from "../../Auths/User/UserAuth.js";
import { FetchPurchaseReturns } from "../../Controllers/FetchPurchaseReturns/FetchPurchaseReturns.Controller.js";

const router = Router();

router.get("/", UserAuth, FetchPurchaseReturns);
export default router;
