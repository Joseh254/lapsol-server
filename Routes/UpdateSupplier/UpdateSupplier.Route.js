import { Router } from "express";
import { UpdateSupplierController } from "../../Controllers/UpdateSupplier/UpdateSupplier.Controller.js";
import { UpdateSupplierrMiddleware } from "../../Middlewares/UpdateSupplier/UpdateSupplier.Middleware.js";
import { UserAuth } from "../../Auths/User/UserAuth.js";
const router = Router();
router.patch(
  "/:id",
  UserAuth,
  UpdateSupplierrMiddleware,
  UpdateSupplierController,
);
export default router;
