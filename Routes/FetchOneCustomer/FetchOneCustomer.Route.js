import { Router } from "express";

import { FetchOneCustomerController } from "../../Controllers/FetchOneCustomer/FetchOneCustomer.Controller.js";
import { UserAuth } from "../../Auths/User/UserAuth.js";

const router = Router();

router.get("/:id", UserAuth, FetchOneCustomerController);

export default router;
