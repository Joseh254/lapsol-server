import { Router } from "express";
import { AddUserController } from "../../Controllers/AddUser/AddUser.Controller.js";
import AdminAuth from "../../Auths/Admin/AdminAuth.js";
import { ValidateUserMiddleware } from "../../Middlewares/ValidateUser/SingUp.Middleware.js";
const router = Router();
router.post("/", ValidateUserMiddleware, AddUserController);
export default router;
