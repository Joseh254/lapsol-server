import { Router } from "express";

import { FetchAllCustomersController } from "../../Controllers/FetchAllCustomers/FetchAllCustomers.Controller.js";
import { UserAuth } from "../../Auths/User/UserAuth.js";

const router = Router();

router.get("/", UserAuth, FetchAllCustomersController);

export default router;
