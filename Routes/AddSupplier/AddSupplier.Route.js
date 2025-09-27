import { Router } from "express";

import { UserAuth } from "../../Auths/User/UserAuth.js";
import { AddSupplierController } from "../../Controllers/AddSupplier/AddSupplier.Controller.js";

const router = Router();
router.post("/", UserAuth, AddSupplierController);
export default router;
