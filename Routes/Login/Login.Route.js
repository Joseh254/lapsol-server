import { Router } from "express";
import { LoginController } from "../../Controllers/LoginController/Login.Controller.js";
import { loginMiddleware } from "../../Middlewares/Login/Login.Middleware.js";
const router = Router();

router.post("/",loginMiddleware, LoginController);

export default router;
