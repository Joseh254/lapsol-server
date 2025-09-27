import { Router } from "express";

import { UserAuth } from "../../Auths/User/UserAuth.js";
import { FetchPayments } from "../../Controllers/FetchPayments/FetchPayments.Controller.js";

const router = Router();
router.get("/", UserAuth, FetchPayments);
export default router;
