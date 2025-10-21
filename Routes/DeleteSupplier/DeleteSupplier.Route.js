import { Router } from "express";

import { deleteSupplierController } from "../../Controllers/DeleteSupplier/DeleteSupplier.Controller.js";

import AdminAuth from "../../Auths/Admin/AdminAuth.js";

const router = Router();

router.delete("/:id", AdminAuth, deleteSupplierController);

export default router;
