import { Router } from "express";

import { UserAuth } from "../../Auths/User/UserAuth.js";
import { RefreshTokenController } from "../../Controllers/RefleshToken/RefleshToken.Controller.js";
const router = Router();

router.post("/", RefreshTokenController);
export default router;
