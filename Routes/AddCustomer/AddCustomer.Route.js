import { Router } from "express";

import { AddCustomerController } from "../../Controllers/AddCustomer/AddCustomer.Controller.js";
import { AddCustomerMiddleware } from "../../Middlewares/AddCustomer/AddCustomer.Middleware.js";

const router = Router();
router.post("/", AddCustomerMiddleware, AddCustomerController);

export default router;
