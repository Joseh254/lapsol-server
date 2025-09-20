import { Router } from "express";

import { FetchCustomerSaleController } from "../../Controllers/FetchCustomerSale/FetchCustomerSale.Controller.js";
import { UserAuth } from "../../Auths/User/UserAuth.js";
const router = Router();
router.get("/:id", UserAuth, FetchCustomerSaleController);

export default router;
