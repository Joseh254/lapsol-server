import { Router } from "express";
import { updateUserController } from "../../Controllers/UpdateUser/UpdateUser.Controller.js";
import AdminAuth from "../../Auths/Admin/AdminAuth.js";
import { UpdateUserMiddleware } from "../../Middlewares/UpdateUser/UpdateUser.Middleware.js";
const router = Router();
router.patch(
  "/:id",

  AdminAuth,
  UpdateUserMiddleware,
  updateUserController,
);
export default router;
