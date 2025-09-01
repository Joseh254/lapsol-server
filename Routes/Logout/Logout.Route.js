import { Router } from "express";
import { LogoutController } from "../../Controllers/Logout/LogoutController.js";

const router = Router();

router.post("/", LogoutController);
export default router;
