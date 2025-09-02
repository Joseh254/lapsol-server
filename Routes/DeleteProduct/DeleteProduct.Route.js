import { Router } from "express";

import { DeleteProductController } from "../../Controllers/DeleteProduct/DeleteProduct.Controller.js";
import AdminAuth from "../../Auths/Admin/AdminAuth.js";

const router = Router();
router.delete("/:id", AdminAuth, DeleteProductController);

export default router;
