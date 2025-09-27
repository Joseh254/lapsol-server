import { Router } from "express";

import { UserAuth } from "../../Auths/User/UserAuth.js";
import { FetchSuppliersController } from "../../Controllers/FetchSuppliers/FetchSuppliers.Controller.js";

const router = Router();
router.get("/", UserAuth, FetchSuppliersController);
export default router;
