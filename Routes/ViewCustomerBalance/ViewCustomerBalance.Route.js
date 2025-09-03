import { Router } from "express";

import { UserAuth } from "../../Auths/User/UserAuth.js";
import { ViewCustomerBalanceController } from "../../Controllers/ViewCustomerBalance/ViewCustomerBalance.Controller.js";
import router from "../Login/Login.Route.js";

router.get("/:id", UserAuth, ViewCustomerBalanceController);

export default router;
