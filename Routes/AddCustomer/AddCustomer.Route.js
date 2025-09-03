import { Router } from "express";

import { AddCustomerController } from "../../Controllers/AddCustomer/AddCustomer.Controller.js";
import { AddCustomerMiddleware } from "../../Middlewares/AddCustomer/AddCustomer.Middleware.js";
import { UserAuth } from "../../Auths/User/UserAuth.js";

const router = Router();
router.post("/", UserAuth, AddCustomerMiddleware, AddCustomerController);

export default router;
