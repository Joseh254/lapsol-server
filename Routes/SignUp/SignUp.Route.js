import { SignUpController } from "../../Controllers/SignUp/SignUp.Controller.js";
import { ValidateUserMiddleware } from "../../Middlewares/ValidateUser/SingUp.Middleware.js";
import { Router } from "express";

const router = Router();
router.post("/", ValidateUserMiddleware, SignUpController);

export default router;
