import { SignUpController } from "../../Controllers/SignUp/SignUp.Controller.js";
import { SignUpMiddleware } from "../../Middlewares/Signup/SingUp.Middleware.js";
import { Router } from "express";

const router = Router();
router.post("/", SignUpMiddleware, SignUpController);

export default router;
