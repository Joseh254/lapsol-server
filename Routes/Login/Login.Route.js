import { Router } from "express";
import { LoginController } from "../../Controllers/LoginController/Login.Controller.js";
const router = Router();

router.post("/", LoginController);

export default router;
