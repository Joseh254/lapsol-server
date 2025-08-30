import { Router } from "express";
import { LogoutController } from "../../Controllers/Logout/Logout.Controller.Js";

const router = Router();

router.post("/", LogoutController);
export default router;