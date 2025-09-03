import { Router } from "express";

import { UserAuth } from "../../Auths/User/UserAuth.js";
import { ReturnProductController } from "../../Controllers/ReturnProduct/ReturnProduct.Controller.js";
const router = Router();

router.post("/", UserAuth, ReturnProductController);
export default router;
