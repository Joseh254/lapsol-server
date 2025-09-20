import { Router } from "express";

import { FetchSalesController } from "../../Controllers/FetchSales/FetchSales.Controller.js";
import { UserAuth } from "../../Auths/User/UserAuth.js";
const router = Router();

router.get("/", UserAuth, FetchSalesController);

export default router;
