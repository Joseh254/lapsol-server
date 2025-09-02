import { Router } from "express";

import { AddProductsController } from "../../Controllers/AddProducts/AddProducts.Controller.js";
import { AddProductMiddleware } from "../../Middlewares/AddProduct/AddProduct.Middleware.js";
import { UserAuth } from "../../Auths/User/UserAuth.js";

const router = Router();
router.post("/", UserAuth, AddProductMiddleware, AddProductsController);

export default router;
