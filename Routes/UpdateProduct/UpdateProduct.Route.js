import { Router } from "express";

import { UpdateProductController } from "../../Controllers/UpdateProduct/UpdateProduct.Controller.js";
import { UpdateProductMiddleware } from "../../Middlewares/UpdateProduct/UpdateProduct.Middleware.js";
import { UserAuth } from "../../Auths/User/UserAuth.js";

const router = Router();

router.patch(
  "/:id",
  UserAuth,
  UpdateProductMiddleware,
  UpdateProductController,
);
export default router;
