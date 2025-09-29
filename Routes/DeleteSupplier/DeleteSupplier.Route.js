import { Router } from "express";

import { deleteSupplierController } from "../../Controllers/DeleteSupplier/DeleteSupplier.Controller.js";
import { UserAuth } from "../../Auths/User/UserAuth.js";

const router = Router();

router.delete("/:id", UserAuth, deleteSupplierController);

export default router;
