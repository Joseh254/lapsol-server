import { Router } from "express";

import { FetchOneCustomerController } from "../../Controllers/FetchOneCustomer/FetchOneCustomer.Controller.js";

const router = Router();

router.get("/:id", FetchOneCustomerController);

export default router;
