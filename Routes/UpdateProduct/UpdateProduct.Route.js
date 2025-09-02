import { Router } from "express";

import { UpdateProductController } from "../../Controllers/UpdateProduct/UpdateProduct.Controller.js";
import { UpdateProductMiddleware } from "../../Middlewares/UpdateProduct/UpdateProduct.Middleware.js";

const router = Router();

router.patch("/:id", UpdateProductMiddleware, UpdateProductController);
export default router;
