import { Router } from "express";

import { AddProductsController } from "../../Controllers/AddProducts/AddProducts.Controller.js";
import { AddProductMiddleware } from "../../Middlewares/AddProduct/AddProduct.Middleware.js";

import AdminAuth from "../../Auths/Admin/AdminAuth.js";

const router = Router();
router.post("/", AdminAuth, AddProductMiddleware, AddProductsController);

export default router;
