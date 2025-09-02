import { Router } from "express";

import { DeleteProductController } from "../../Controllers/DeleteProduct/DeleteProduct.Controller.js";
import { UserAuth } from "../../Auths/User/UserAuth.js";

const router = Router();
router.delete("/:id", UserAuth, DeleteProductController);

export default router;
