import { Router } from "express";

import { UpdateProductController } from "../../Controllers/UpdateProduct/UpdateProduct.Controller.js";
import { UpdateProductMiddleware } from "../../Middlewares/UpdateProduct/UpdateProduct.Middleware.js";
import AdminAuth from "../../Auths/Admin/AdminAuth.js";

const router = Router();

router.patch(
  "/:id",
  AdminAuth,
  UpdateProductMiddleware,
  UpdateProductController,
);
export default router;
