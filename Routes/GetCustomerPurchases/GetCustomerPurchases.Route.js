import { Router } from "express";

import { UserAuth } from "../../Auths/User/UserAuth.js";
import { GetCustomerPurchases } from "../../Controllers/GetCustomerPurchases/GetCustomerPurchases.Controller.js";

const router = Router();

router.get("/:customerId", UserAuth, GetCustomerPurchases);
export default router;
